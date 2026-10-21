import { createServerFn } from "@tanstack/react-start";
import snapshotJson from "@/lib/market-snapshot.json";
import { SITO } from "@/lib/sito";

export const FRAMES = ["5m", "15m", "1h", "4h", "1d"] as const;
export type Frame = (typeof FRAMES)[number];

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Market = {
  priceUsd: number | null;
  change24h: number | null;
  fdvUsd: number | null;
  liquidityUsd: number | null;
  volume24hUsd: number | null;
  txs24h: number | null;
  graduationPct: number | null;
  graduated: boolean;
  candles: Candle[];
  updatedAt: number;
  live: boolean;
  error: string | null;
};

export const INDEXED_MARKET: Market = snapshotJson;

const cache = new Map<Frame, { at: number; market: Market }>();
const inflight = new Map<Frame, Promise<Market>>();
const TTL_MS = 30_000;

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isFrame(value: unknown): value is Frame {
  return value === "5m" || value === "15m" || value === "1h" || value === "4h" || value === "1d";
}

function ohlcvUrl(frame: Frame) {
  const base = `https://api.geckoterminal.com/api/v2/networks/solana/pools/${SITO.pool}/ohlcv`;
  if (frame === "5m") return `${base}/minute?aggregate=5&limit=96&currency=usd`;
  if (frame === "15m") return `${base}/minute?aggregate=15&limit=96&currency=usd`;
  if (frame === "1h") return `${base}/hour?aggregate=1&limit=72&currency=usd`;
  if (frame === "4h") return `${base}/hour?aggregate=4&limit=48&currency=usd`;
  return `${base}/day?aggregate=1&limit=60&currency=usd`;
}

function readCandles(payload: unknown): Candle[] {
  if (!payload || typeof payload !== "object" || !("data" in payload)) return [];
  const data = payload.data;
  if (!data || typeof data !== "object" || !("attributes" in data)) return [];
  const attributes = data.attributes;
  if (!attributes || typeof attributes !== "object" || !("ohlcv_list" in attributes)) return [];
  const list = attributes.ohlcv_list;
  if (!Array.isArray(list)) return [];

  const candles: Candle[] = [];
  for (const row of list) {
    if (!Array.isArray(row) || row.length < 5) continue;
    const time = num(row[0]);
    const open = num(row[1]);
    const high = num(row[2]);
    const low = num(row[3]);
    const close = num(row[4]);
    const volume = num(row[5]) ?? 0;
    if (time == null || open == null || high == null || low == null || close == null) continue;
    candles.push({ time, open, high, low, close, volume });
  }
  candles.sort((a, b) => a.time - b.time);
  return candles;
}

async function getJson(url: string, attempt = 0): Promise<unknown> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 429 && attempt < 2) {
    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
    return getJson(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`Market feed returned ${response.status}`);
  return response.json();
}

async function loadMarket(frame: Frame): Promise<Market> {
  try {
    const poolPayload = await getJson(
      `https://api.geckoterminal.com/api/v2/networks/solana/pools/${SITO.pool}`,
    );
    const candlePayload = await getJson(ohlcvUrl(frame));

    const attributes =
      poolPayload &&
      typeof poolPayload === "object" &&
      "data" in poolPayload &&
      poolPayload.data &&
      typeof poolPayload.data === "object" &&
      "attributes" in poolPayload.data
        ? poolPayload.data.attributes
        : null;

    const record =
      attributes && typeof attributes === "object" ? (attributes as Record<string, unknown>) : {};
    const changes =
      record.price_change_percentage && typeof record.price_change_percentage === "object"
        ? (record.price_change_percentage as Record<string, unknown>)
        : {};
    const volume =
      record.volume_usd && typeof record.volume_usd === "object"
        ? (record.volume_usd as Record<string, unknown>)
        : {};
    const txs =
      record.transactions && typeof record.transactions === "object"
        ? (record.transactions as Record<string, unknown>).h24
        : null;
    const txRecord = txs && typeof txs === "object" ? (txs as Record<string, unknown>) : {};
    const launch =
      record.launchpad_details && typeof record.launchpad_details === "object"
        ? (record.launchpad_details as Record<string, unknown>)
        : {};
    const candles = readCandles(candlePayload);

    return {
      priceUsd: num(record.base_token_price_usd),
      change24h: num(changes.h24),
      fdvUsd: num(record.fdv_usd),
      liquidityUsd: num(record.reserve_in_usd),
      volume24hUsd: num(volume.h24),
      txs24h: (num(txRecord.buys) ?? 0) + (num(txRecord.sells) ?? 0),
      graduationPct: num(launch.graduation_percentage),
      graduated: launch.completed === true,
      candles: candles.length > 0 ? candles : INDEXED_MARKET.candles,
      updatedAt: Date.now(),
      live: true,
      error: null,
    };
  } catch (error) {
    const cached = cache.get(frame);
    if (cached) return cached.market;
    const message = error instanceof Error ? error.message : "Market feed unavailable";
    return {
      ...INDEXED_MARKET,
      live: false,
      error: message,
    };
  }
}

export const getMarket = createServerFn({ method: "GET" })
  .validator((input: unknown): { frame: Frame } => {
    if (input && typeof input === "object" && "frame" in input && isFrame(input.frame)) {
      return { frame: input.frame };
    }
    return { frame: "1h" };
  })
  .handler(async ({ data }): Promise<Market> => {
    const hit = cache.get(data.frame);
    if (hit && Date.now() - hit.at < TTL_MS) return hit.market;

    const pending = inflight.get(data.frame);
    if (pending) return pending;

    const job = loadMarket(data.frame).finally(() => {
      inflight.delete(data.frame);
    });
    inflight.set(data.frame, job);
    const market = await job;
    if (market.live) cache.set(data.frame, { at: Date.now(), market });
    return market;
  });
