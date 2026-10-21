import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpRight, Check, Copy, Cpu, FileText, ShieldCheck, TrainFront } from "lucide-react";
import { LiveChart } from "@/components/live-chart";
import { SITO, shortMint } from "@/lib/sito";

export const Route = createFileRoute("/")({ component: Home });

const WHITEPAPER_VIEW_URL = "https://drive.google.com/file/d/1zstMm7Qpv102vJLHo6yCM5qz3PMIcVXz/view?usp=drive_link";
const WHITEPAPER_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1zstMm7Qpv102vJLHo6yCM5qz3PMIcVXz";

const NAV = [
  { href: "#chart", label: "Chart" },
  { href: "#thesis", label: "Thesis" },
  { href: "#tarc", label: "TARC" },
  { href: "#whitepaper", label: "Whitepaper" },
  { href: "#buy", label: "Buy" },
];

function Home() {
  return (
    <div className="min-h-screen text-fg">
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-10 sm:px-6 sm:py-16">
        <Hero />
        <LiveChart />
        <Thesis />
        <Tarc />
        <Facts />
        <Whitepaper />
        <Buy />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:px-6">
          <p>
            Market figures are read from a public pool feed and can lag or fail. Nothing here is an offer,
            a listing, or financial advice. Tokens can go to zero.
          </p>
          <p>Built from the public posts on @CongoGutzi. Confirm the mint before you swap.</p>
        </div>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <img src="/sito-mark.jpg" alt="" className="size-10 rounded-xl bg-fg object-cover" />
          <span className="leading-tight">
            <span className="block font-display text-lg">SITO</span>
            <span className="block text-xs text-muted">Super Intelligence</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Page">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm text-muted hover:text-fg">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={WHITEPAPER_VIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-fg hover:border-copper lg:inline-flex"
          >
            <FileText className="size-4 text-copper" aria-hidden="true" />
            Whitepaper
          </a>
          <CopyMint compact />
          <a
            href={SITO.jupiter}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1 rounded-full bg-copper px-4 text-sm font-medium text-bg"
          >
            Buy
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden" aria-label="Page">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full border border-line px-3 py-2 text-sm text-muted"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="grid items-end gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="text-sm font-medium tracking-wide text-copper uppercase">Solana · pump.fun · fair launch</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-fg sm:text-6xl">
          A supertoken for megaprojects.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          SITO is the Super Intelligence Token posted by @CongoGutzi. The brief on their X account: beat the
          AI-ticker pile, and put weight behind work the size of a railway.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={SITO.jupiter}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-bg"
          >
            Swap on Jupiter
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#chart"
            className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm text-fg"
          >
            Open the chart
          </a>
        </div>
      </div>
      <aside className="rounded-card border border-line bg-surface p-5 lg:col-span-5">
        <p className="text-xs tracking-wide text-muted uppercase">Contract</p>
        <p className="mt-2 font-display text-2xl">SITO on Solana</p>
        <p className="mt-3 break-all text-sm text-muted tabular-nums">{SITO.mint}</p>
        <div className="mt-4">
          <CopyMint />
        </div>
        <p className="mt-4 text-sm text-muted">
          Not any other “Super Intelligence” mint. Match this address before you sign.
        </p>
      </aside>
    </section>
  );
}

function Thesis() {
  const points = [
    {
      icon: Cpu,
      title: "Above the AI pile",
      body: "The account calls SITO the SI token that beats AI tokens — a supertoken, not another chatbot ticker.",
    },
    {
      icon: ShieldCheck,
      title: "Fair from the first block",
      body: "They posted a fair launch. The pool is still the pump.fun curve, created 11 Oct 2026, so the chart shows that early tape.",
    },
    {
      icon: TrainFront,
      title: "Built to fund work",
      body: "On 15 Oct they wrote that SITO already holds 3.2% of supply and already supports the TARC megaproject.",
    },
  ];

  return (
    <section id="thesis" className="scroll-mt-24">
      <p className="text-sm font-medium tracking-wide text-copper uppercase">From the X account</p>
      <h2 className="mt-2 max-w-2xl font-display text-3xl sm:text-4xl">What @CongoGutzi actually says SITO is.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <article key={point.title} className="rounded-card border border-line bg-surface p-5">
            <point.icon className="size-5 text-copper" aria-hidden="true" />
            <h3 className="mt-4 font-display text-2xl">{point.title}</h3>
            <p className="mt-2 text-sm text-muted">{point.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Tarc() {
  const rails = [
    "Railway corridors that move goods and people between African markets.",
    "A digital-finance layer for payments, trade, and access across borders.",
    "SITO’s stated job: power and support that first megaproject.",
  ];

  return (
    <section id="tarc" className="scroll-mt-24">
      <div className="grid gap-8 rounded-card border border-line bg-surface p-6 sm:p-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-wide text-copper uppercase">Megaproject</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Trans Africa Railway.</h2>
          <p className="mt-4 text-muted">
            The posts pair SITO with TARC — Trans Africa Railway Corporation. The public vision is
            infrastructure plus a blockchain rail for trade, not a sticker on an AI meme.
          </p>
          <a
            href={SITO.tarc}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-copper"
          >
            tarcltd.com
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <ol className="flex flex-col gap-4">
          {rails.map((item, index) => (
            <li key={item} className="flex gap-4 border-t border-line pt-4 first:border-t-0 first:pt-0">
              <span className="font-display text-copper tabular-nums">0{index + 1}</span>
              <p className="text-sm text-fg">{item}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Facts() {
  const rows = [
    ["Ticker", SITO.ticker],
    ["Name", SITO.name],
    ["Chain", SITO.chain],
    ["Supply", "1,000,000,000"],
    ["Decimals", String(SITO.decimals)],
    ["Launch", "11 Oct 2026 · pump.fun"],
    ["Pool", "SITO / SOL"],
    ["X", "@CongoGutzi"],
  ];

  return (
    <section className="scroll-mt-24">
      <h2 className="font-display text-3xl sm:text-4xl">The mint, in one table.</h2>
      <dl className="mt-6 divide-y divide-line rounded-card border border-line bg-surface">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="text-sm text-fg sm:col-span-2">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <TextLink href={SITO.x}>X</TextLink>
        <TextLink href={SITO.telegram}>Telegram</TextLink>
        <TextLink href={SITO.solscan}>Solscan</TextLink>
        <TextLink href={SITO.gecko}>GeckoTerminal</TextLink>
        <TextLink href={SITO.pump}>pump.fun</TextLink>
      </div>
    </section>
  );
}

function Whitepaper() {
  return (
    <section id="whitepaper" className="scroll-mt-28">
      <div className="relative overflow-hidden rounded-card border border-line bg-surface p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-copper/10 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-medium tracking-wide text-copper uppercase">Read the details</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-line bg-bg">
                <FileText className="size-6 text-copper" aria-hidden="true" />
              </span>
              <h2 className="font-display text-3xl sm:text-4xl">SITO Whitepaper</h2>
            </div>
            <p className="mt-4 max-w-2xl text-muted">
              Explore the SITO whitepaper for more information about the project. The document is hosted on Google Drive.
            </p>
            <p className="mt-2 text-xs text-muted">Please review the document and verify project details independently.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={WHITEPAPER_VIEW_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-fg hover:border-copper"
            >
              Read whitepaper
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href={WHITEPAPER_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-bg"
            >
              Download PDF
              <ArrowDownToLine className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Buy() {
  const steps = [
    "Open Phantom, Solflare, or another Solana wallet and fund it with SOL.",
    "Paste the SITO mint, or use the Jupiter link so the mint is already selected.",
    "Check the address ends in yVpump, then confirm the swap yourself.",
  ];

  return (
    <section id="buy" className="scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-wide text-copper uppercase">How to buy</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Three steps. Then you check the mint.</h2>
          <ol className="mt-6 flex flex-col gap-4">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-sm tabular-nums">
                  {index + 1}
                </span>
                <p className="text-sm text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-card border border-line bg-surface p-6">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Mint</p>
            <p className="mt-2 break-all text-sm tabular-nums">{SITO.mint}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CopyMint />
            <a
              href={SITO.jupiter}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-bg"
            >
              Buy {shortMint(SITO.mint)}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 text-copper">
      {children}
      <ArrowUpRight className="size-4" aria-hidden="true" />
    </a>
  );
}

function CopyMint({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(SITO.mint);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-fg"
    >
      {copied ? <Check className="size-4 text-copper" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {copied ? "Copied" : compact ? shortMint(SITO.mint) : "Copy mint"}
    </button>
  );
}
