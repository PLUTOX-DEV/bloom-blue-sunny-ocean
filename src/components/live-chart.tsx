import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FRAMES, getMarket, INDEXED_MARKET, type Frame, type Market } from "@/lib/market";

function formatPrice(value: number | null) {
  if (value == null || !Number.isFinite(value)) return "—";
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  const fixed = value.toFixed(12);
  const match = fixed.match(/^0\.(0+)([1-9]\d*)/);
  if (match && match[1].length >= 3) {
    const zeros = "₀₁₂₃₄₅₆₇₈₉";
    const sub = String(match[1].length)
      .split("")
      .map((digit) => zeros[Number(digit)])
      .join("");
    const digits = match[2].slice(0, 4);
    return `$0.0${sub}${digits}`;
  }
  return `$${fixed.replace(/0+$/, "")}`;
}

function formatCompact(value: number | null) {
  if (value == null || !Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs === 0) return "$0";
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  if (abs >= 1) return `${sign}$${abs.toFixed(2)}`;
  return formatPrice(value);
}

function formatSigned(value: number | null) {
  if (value == null || !Number.isFinite(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function clock(time: number) {
  const date = new Date(time);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${hours}:${minutes} UTC`;
}

export function LiveChart() {
  const [frame, setFrame] = useState<Frame>("1h");
  const [market, setMarket] = useState<Market>(INDEXED_MARKET);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const next = await getMarket({ data: { frame } });
        if (!cancelled) setMarket(next);
      } catch {
        if (!cancelled) {
          setMarket((current) =>
            current.candles.length > 0
              ? current
              : { ...INDEXED_MARKET, error: "Live feed unavailable" },
          );
        }
      }
    };

    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 40000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [frame]);

  const up = (market?.change24h ?? 0) >= 0;
  const tone = up ? "text-copper" : "text-clay";
  const candles = market?.candles ?? [];

  return (
    <section id="chart" className="scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-copper uppercase">Live market</p>
          <h2 className="font-display text-3xl text-fg sm:text-4xl">SITO / USD</h2>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Chart range">
          {FRAMES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={frame === item}
              onClick={() => setFrame(item)}
              className={
                frame === item
                  ? "min-h-11 rounded-full bg-copper px-4 text-sm font-medium text-bg"
                  : "min-h-11 rounded-full border border-line bg-surface px-4 text-sm text-muted"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-line bg-surface p-4 sm:p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Price" value={formatPrice(market?.priceUsd ?? null)} detail={formatSigned(market?.change24h ?? null)} detailClass={tone} />
          <Stat label="FDV" value={formatCompact(market?.fdvUsd ?? null)} detail="Fully diluted" />
          <Stat label="Liquidity" value={formatCompact(market?.liquidityUsd ?? null)} detail="Pool reserves" />
          <Stat
            label="24h volume"
            value={formatCompact(market?.volume24hUsd ?? null)}
            detail={market?.txs24h == null ? "Trades" : `${market.txs24h} trades`}
          />
        </div>

        <div className="h-64 sm:h-80">
          {!mounted || candles.length === 0 ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
              {market.error ?? "Waiting for the first print."}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={candles} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sitoFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e0a45a" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#e0a45a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#24302c" vertical={false} />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value: number) =>
                    format(new Date(value * 1000), frame === "1d" || frame === "4h" ? "MMM d" : "HH:mm")
                  }
                  tick={{ fill: "#93a39b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={28}
                />
                <YAxis
                  dataKey="close"
                  domain={["auto", "auto"]}
                  tickFormatter={(value: number) => value.toExponential(1)}
                  tick={{ fill: "#93a39b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={88}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0]?.payload as { time: number; close: number; volume: number };
                    return (
                      <div className="rounded-xl border border-line bg-bg px-3 py-2 text-xs">
                        <p className="text-muted">{format(new Date(point.time * 1000), "MMM d, HH:mm")}</p>
                        <p className="mt-1 font-medium text-fg tabular-nums">{formatPrice(point.close)}</p>
                        <p className="text-muted tabular-nums">Vol {formatCompact(point.volume)}</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#e0a45a"
                  strokeWidth={2}
                  fill="url(#sitoFill)"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <p className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-copper" aria-hidden="true" />
            {market.live ? "Live · about every 40s" : "Indexed tape · live feed retries in the background"}
            {mounted ? <span className="tabular-nums">· {clock(market.updatedAt)} UTC</span> : null}
          </p>
          <p>Pump.fun curve {market.graduationPct == null ? "—" : `${market.graduationPct.toFixed(1)}%`}</p>
        </div>
        {market.error && candles.length === 0 ? <p className="mt-3 text-sm text-clay">{market.error}</p> : null}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  detail,
  detailClass = "text-muted",
}: {
  label: string;
  value: string;
  detail: string;
  detailClass?: string;
}) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-xl font-medium text-fg tabular-nums">{value}</p>
      <p className={`text-sm tabular-nums ${detailClass}`}>{detail}</p>
    </div>
  );
}
