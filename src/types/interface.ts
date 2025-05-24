import config from "constants/config"
import { Candle, Route, Token } from "./response"
import { Hex } from "viem"

const apiURL = config.apiUrl

const endpoints = {
  tokens: "/tokens",
  prices: "/prices",
  route: "/route",
  balance: "/balance",
} as const

type Endpoints = keyof typeof endpoints

interface EndpointOptions {
  tokens: {
    method: "GET"
    query?: { symbol: string }
    response: Array<Token>
  }
  prices: {
    method: "GET"
    query: { symbol: string }
    body?: {
      timeRange?: TimeRange
    }
    response: Array<Candle>
  }
  route: {
    method: "GET"
    query?: never
    body: {
      fromToken: Hex
      toToken: Hex
      amount: string
      chain: string
    }
    response: Route
  }
  balance: {
    method: "GET"
    query?: never
    body: {
      user: Hex
      timeRange?: TimeRange
    }
    response: Array<[number, number]>
  }
}

export { apiURL, endpoints }
export type { Endpoints, EndpointOptions }
