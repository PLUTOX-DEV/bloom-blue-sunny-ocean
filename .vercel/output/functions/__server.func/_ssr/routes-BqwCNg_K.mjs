import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as market_snapshot_default, r as shortMint, t as SITO } from "./sito-Byuq3PoX.mjs";
import { a as Copy, i as Cpu, n as TrainFront, o as Check, r as ShieldCheck, s as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BqwCNg_K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var FRAMES = [
	"5m",
	"15m",
	"1h",
	"4h",
	"1d"
];
var INDEXED_MARKET = market_snapshot_default;
function isFrame(value) {
	return value === "5m" || value === "15m" || value === "1h" || value === "4h" || value === "1d";
}
var getMarket = createServerFn({ method: "GET" }).validator((input) => {
	if (input && typeof input === "object" && "frame" in input && isFrame(input.frame)) return { frame: input.frame };
	return { frame: "1h" };
}).handler(createSsrRpc("a2575aed83179287c9ce058ea37755e3ecce9cf83fe6c656465762fc51982cd8"));
function formatPrice(value) {
	if (value == null || !Number.isFinite(value)) return "—";
	if (value >= 1) return `$${value.toFixed(2)}`;
	if (value >= .01) return `$${value.toFixed(4)}`;
	const fixed = value.toFixed(12);
	const match = fixed.match(/^0\.(0+)([1-9]\d*)/);
	if (match && match[1].length >= 3) {
		const zeros = "₀₁₂₃₄₅₆₇₈₉";
		return `$0.0${String(match[1].length).split("").map((digit) => zeros[Number(digit)]).join("")}${match[2].slice(0, 4)}`;
	}
	return `$${fixed.replace(/0+$/, "")}`;
}
function formatCompact(value) {
	if (value == null || !Number.isFinite(value)) return "—";
	const abs = Math.abs(value);
	const sign = value < 0 ? "-" : "";
	if (abs === 0) return "$0";
	if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
	if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
	if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(2)}K`;
	if (abs >= 1) return `${sign}$${abs.toFixed(2)}`;
	return formatPrice(value);
}
function formatSigned(value) {
	if (value == null || !Number.isFinite(value)) return "—";
	return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}
function clock(time) {
	const date = new Date(time);
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	const hours = String(date.getUTCHours()).padStart(2, "0");
	const minutes = String(date.getUTCMinutes()).padStart(2, "0");
	return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${hours}:${minutes} UTC`;
}
function LiveChart() {
	const [frame, setFrame] = (0, import_react.useState)("1h");
	const [market, setMarket] = (0, import_react.useState)(INDEXED_MARKET);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const load = async () => {
			try {
				const next = await getMarket({ data: { frame } });
				if (!cancelled) setMarket(next);
			} catch {
				if (!cancelled) setMarket((current) => current.candles.length > 0 ? current : {
					...INDEXED_MARKET,
					error: "Live feed unavailable"
				});
			}
		};
		load();
		const timer = window.setInterval(() => {
			load();
		}, 4e4);
		return () => {
			cancelled = true;
			window.clearInterval(timer);
		};
	}, [frame]);
	const tone = (market?.change24h ?? 0) >= 0 ? "text-copper" : "text-clay";
	const candles = market?.candles ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "chart",
		className: "scroll-mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium tracking-wide text-copper uppercase",
				children: "Live market"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl text-fg sm:text-4xl",
				children: "SITO / USD"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				role: "tablist",
				"aria-label": "Chart range",
				children: FRAMES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": frame === item,
					onClick: () => setFrame(item),
					className: frame === item ? "min-h-11 rounded-full bg-copper px-4 text-sm font-medium text-bg" : "min-h-11 rounded-full border border-line bg-surface px-4 text-sm text-muted",
					children: item
				}, item))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-card border border-line bg-surface p-4 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Price",
							value: formatPrice(market?.priceUsd ?? null),
							detail: formatSigned(market?.change24h ?? null),
							detailClass: tone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "FDV",
							value: formatCompact(market?.fdvUsd ?? null),
							detail: "Fully diluted"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Liquidity",
							value: formatCompact(market?.liquidityUsd ?? null),
							detail: "Pool reserves"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "24h volume",
							value: formatCompact(market?.volume24hUsd ?? null),
							detail: market?.txs24h == null ? "Trades" : `${market.txs24h} trades`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 sm:h-80",
					children: !mounted || candles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full items-center justify-center px-6 text-center text-sm text-muted",
						children: market.error ?? "Waiting for the first print."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: candles,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "sitoFill",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "#e0a45a",
										stopOpacity: .35
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "#e0a45a",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "#24302c",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "time",
									tickFormatter: (value) => format(/* @__PURE__ */ new Date(value * 1e3), frame === "1d" || frame === "4h" ? "MMM d" : "HH:mm"),
									tick: {
										fill: "#93a39b",
										fontSize: 12
									},
									axisLine: false,
									tickLine: false,
									minTickGap: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									dataKey: "close",
									domain: ["auto", "auto"],
									tickFormatter: (value) => value.toExponential(1),
									tick: {
										fill: "#93a39b",
										fontSize: 12
									},
									axisLine: false,
									tickLine: false,
									width: 88
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
									if (!active || !payload?.length) return null;
									const point = payload[0]?.payload;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-line bg-bg px-3 py-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted",
												children: format(/* @__PURE__ */ new Date(point.time * 1e3), "MMM d, HH:mm")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 font-medium text-fg tabular-nums",
												children: formatPrice(point.close)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-muted tabular-nums",
												children: ["Vol ", formatCompact(point.volume)]
											})
										]
									});
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "close",
									stroke: "#e0a45a",
									strokeWidth: 2,
									fill: "url(#sitoFill)",
									dot: false,
									isAnimationActive: false
								})
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block size-2 rounded-full bg-copper",
								"aria-hidden": "true"
							}),
							market.live ? "Live · about every 40s" : "Indexed tape · live feed retries in the background",
							mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [
									"· ",
									clock(market.updatedAt),
									" UTC"
								]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Pump.fun curve ", market.graduationPct == null ? "—" : `${market.graduationPct.toFixed(1)}%`] })]
				}),
				market.error && candles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-clay",
					children: market.error
				}) : null
			]
		})]
	});
}
function Stat({ label, value, detail, detailClass = "text-muted" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wide text-muted uppercase",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xl font-medium text-fg tabular-nums",
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `text-sm tabular-nums ${detailClass}`,
			children: detail
		})
	] });
}
var NAV = [
	{
		href: "#chart",
		label: "Chart"
	},
	{
		href: "#thesis",
		label: "Thesis"
	},
	{
		href: "#tarc",
		label: "TARC"
	},
	{
		href: "#buy",
		label: "Buy"
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex max-w-6xl flex-col gap-20 px-4 py-10 sm:px-6 sm:py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveChart, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thesis, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tarc, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facts, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Buy, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Market figures are read from a public pool feed and can lag or fail. Nothing here is an offer, a listing, or financial advice. Tokens can go to zero." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Built from the public posts on @CongoGutzi. Confirm the mint before you swap." })]
				})
			})
		]
	});
}
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#top",
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/sito-mark.jpg",
						alt: "",
						className: "size-10 rounded-xl bg-fg object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-lg",
							children: "SITO"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted",
							children: "Super Intelligence"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 md:flex",
					"aria-label": "Page",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						className: "rounded-full px-3 py-2 text-sm text-muted hover:text-fg",
						children: item.label
					}, item.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyMint, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: SITO.jupiter,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex min-h-11 items-center gap-1 rounded-full bg-copper px-4 text-sm font-medium text-bg",
						children: ["Buy", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
							className: "size-4",
							"aria-hidden": "true"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex gap-2 overflow-x-auto px-4 pb-3 md:hidden",
			"aria-label": "Page",
			children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: item.href,
				className: "shrink-0 rounded-full border border-line px-3 py-2 text-sm text-muted",
				children: item.label
			}, item.href))
		})]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "grid items-end gap-10 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-wide text-copper uppercase",
					children: "Solana · pump.fun · fair launch"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-5xl leading-none text-fg sm:text-6xl",
					children: "A supertoken for megaprojects."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-xl text-lg text-muted",
					children: "SITO is the Super Intelligence Token posted by @CongoGutzi. The brief on their X account: beat the AI-ticker pile, and put weight behind work the size of a railway."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: SITO.jupiter,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-bg",
						children: ["Swap on Jupiter", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
							className: "size-4",
							"aria-hidden": "true"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#chart",
						className: "inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm text-fg",
						children: "Open the chart"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-card border border-line bg-surface p-5 lg:col-span-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted uppercase",
					children: "Contract"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl",
					children: "SITO on Solana"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 break-all text-sm text-muted tabular-nums",
					children: SITO.mint
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyMint, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Not any other “Super Intelligence” mint. Match this address before you sign."
				})
			]
		})]
	});
}
function Thesis() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "thesis",
		className: "scroll-mt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium tracking-wide text-copper uppercase",
				children: "From the X account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 max-w-2xl font-display text-3xl sm:text-4xl",
				children: "What @CongoGutzi actually says SITO is."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-3",
				children: [
					{
						icon: Cpu,
						title: "Above the AI pile",
						body: "The account calls SITO the SI token that beats AI tokens — a supertoken, not another chatbot ticker."
					},
					{
						icon: ShieldCheck,
						title: "Fair from the first block",
						body: "They posted a fair launch. The pool is still the pump.fun curve, created 11 Oct 2026, so the chart shows that early tape."
					},
					{
						icon: TrainFront,
						title: "Built to fund work",
						body: "On 15 Oct they wrote that SITO already holds 3.2% of supply and already supports the TARC megaproject."
					}
				].map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(point.icon, {
							className: "size-5 text-copper",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 font-display text-2xl",
							children: point.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: point.body
						})
					]
				}, point.title))
			})
		]
	});
}
function Tarc() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "tarc",
		className: "scroll-mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 rounded-card border border-line bg-surface p-6 sm:p-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-wide text-copper uppercase",
					children: "Megaproject"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl sm:text-4xl",
					children: "Trans Africa Railway."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted",
					children: "The posts pair SITO with TARC — Trans Africa Railway Corporation. The public vision is infrastructure plus a blockchain rail for trade, not a sticker on an AI meme."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: SITO.tarc,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-copper",
					children: ["tarcltd.com", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
						className: "size-4",
						"aria-hidden": "true"
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-4",
				children: [
					"Railway corridors that move goods and people between African markets.",
					"A digital-finance layer for payments, trade, and access across borders.",
					"SITO’s stated job: power and support that first megaproject."
				].map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-4 border-t border-line pt-4 first:border-t-0 first:pt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-copper tabular-nums",
						children: ["0", index + 1]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: item
					})]
				}, item))
			})]
		})
	});
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
		["X", "@CongoGutzi"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "scroll-mt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl sm:text-4xl",
				children: "The mint, in one table."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "mt-6 divide-y divide-line rounded-card border border-line bg-surface",
				children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-sm text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-sm text-fg sm:col-span-2",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						href: SITO.x,
						children: "X"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						href: SITO.telegram,
						children: "Telegram"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						href: SITO.solscan,
						children: "Solscan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						href: SITO.gecko,
						children: "GeckoTerminal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextLink, {
						href: SITO.pump,
						children: "pump.fun"
					})
				]
			})
		]
	});
}
function Buy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "buy",
		className: "scroll-mt-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium tracking-wide text-copper uppercase",
					children: "How to buy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl sm:text-4xl",
					children: "Three steps. Then you check the mint."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 flex flex-col gap-4",
					children: [
						"Open Phantom, Solflare, or another Solana wallet and fund it with SOL.",
						"Paste the SITO mint, or use the Jupiter link so the mint is already selected.",
						"Check the address ends in yVpump, then confirm the swap yourself."
					].map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-8 shrink-0 items-center justify-center rounded-full border border-line text-sm tabular-nums",
							children: index + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: step
						})]
					}, step))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-between gap-6 rounded-card border border-line bg-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted uppercase",
					children: "Mint"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 break-all text-sm tabular-nums",
					children: SITO.mint
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyMint, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: SITO.jupiter,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-copper px-5 text-sm font-medium text-bg",
						children: [
							"Buy ",
							shortMint(SITO.mint),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "size-4",
								"aria-hidden": "true"
							})
						]
					})]
				})]
			})]
		})
	});
}
function TextLink({ href, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href,
		target: "_blank",
		rel: "noreferrer",
		className: "inline-flex min-h-11 items-center gap-1 text-copper",
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
			className: "size-4",
			"aria-hidden": "true"
		})]
	});
}
function CopyMint({ compact = false }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: async () => {
			try {
				await navigator.clipboard.writeText(SITO.mint);
				setCopied(true);
				window.setTimeout(() => setCopied(false), 1600);
			} catch {
				setCopied(false);
			}
		},
		className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-fg",
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-4 text-copper",
			"aria-hidden": "true"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
			className: "size-4",
			"aria-hidden": "true"
		}), copied ? "Copied" : compact ? shortMint(SITO.mint) : "Copy mint"]
	});
}
//#endregion
export { Home as component };
