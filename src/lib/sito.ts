export const SITO = {
  name: "Super Intelligence Token",
  ticker: "SITO",
  chain: "Solana",
  mint: "7ps8RqzufeCGe7qiqJTXnSZGRoHSuNHMqH7uSGyVpump",
  pool: "CzkJMkAkieRMBLnZVx9Ls4ZKBpZhzKLKt7A36Z7PJNJH",
  supply: 1_000_000_000,
  decimals: 6,
  launched: "2026-10-11",
  x: "https://x.com/CongoGutzi",
  telegram: "https://t.me/Superintelligence_Token_SI",
  tarc: "https://tarcltd.com",
  solscan: "https://solscan.io/token/7ps8RqzufeCGe7qiqJTXnSZGRoHSuNHMqH7uSGyVpump",
  gecko: "https://www.geckoterminal.com/solana/pools/CzkJMkAkieRMBLnZVx9Ls4ZKBpZhzKLKt7A36Z7PJNJH",
  pump: "https://pump.fun/coin/7ps8RqzufeCGe7qiqJTXnSZGRoHSuNHMqH7uSGyVpump",
  jupiter: "https://jup.ag/swap/SOL-7ps8RqzufeCGe7qiqJTXnSZGRoHSuNHMqH7uSGyVpump",
} as const;

export function shortMint(mint: string) {
  return `${mint.slice(0, 4)}…${mint.slice(-4)}`;
}
