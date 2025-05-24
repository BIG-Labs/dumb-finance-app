import { Token } from "types/response"

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
  "Dec",
] as const

const tokens: Array<Token> = [
  {
    id: 1,
    icon: "/tokens/Avax.svg",
    name: "Wrapped Avax",
    symbol: "WAVAX",
    price: 18.68,
    decimals: 18,
    percentChange: 1.247,
    chainId: 43_114,
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  },
  {
    id: 2,
    icon: "/tokens/USDC.svg",
    name: "USD Coin",
    symbol: "USDC",
    price: 1.0,
    decimals: 6,
    percentChange: 0.01,
    chainId: 43_114,
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  },
]

export { months, tokens }
