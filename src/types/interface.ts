import config from "constants/config"

export const gatewayURL = `${config.apiUrl}`

export const gatewayEndpoints = [
  "statistics",
  "arbitrages",
  "tokens",
  "token-statistics",
  "daily-token-statistics",
  "sender-statistics",
] as const
export type GatewayEndpoints = (typeof gatewayEndpoints)[number]

export const gatewayEndpointsPath: Record<
  GatewayEndpoints,
  (param?: string) => string
> = {
  statistics: (period) => `/statistics/${period}`,
  arbitrages: () => `/arbitrages`,
  tokens: () => `/tokens`,
  "token-statistics": (period) => `/token-statistics/${period}`,
  "daily-token-statistics": (period) => `/token-statistics/${period}/daily`,
  "sender-statistics": (period) => `/sender-statistics/${period}`,
}

export interface GatewayEndpointsInput {
  statistics: undefined
  arbitrages: Partial<{
    address: string
    page: number
    per_page: number
    sortBy: "-usd_profit" | "usd_profit"
  }>
  tokens: Partial<{
    name: string
    page: number
    per_page: number
  }>
  "token-statistics": Partial<{
    address: string
    page: number
    per_page: number
    sortBy: "total_arbitrages" | "profit_usd" | "-profit_usd"
  }>
  "daily-token-statistics": { per_page: number }
  "sender-statistics": {
    per_page: number
    sortBy: "total_arbitrages" | "profit_usd" | "-profit_usd"
  }
}
