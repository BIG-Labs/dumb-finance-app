import { Hex } from "viem"

type Token = {
  id: number
  address: string
  icon: string
  name: string
  symbol: string
  decimals: number
  price: number
  chainId: number
  percentChange: number
  tokenOrigin?: {
    name: string
    id: number
  }
}

type Path = {
  id: number
  address: Hex
  icon: string
  name: string
  symbol: string
  decimals: number
}

type Route = {
  amountOut: string
  priceChange: number
  paths: Array<Path>
}

type Candle = [number, number, number, number, number]

type AuthResponse = {
  accessToken: string
  refreshToken: string
}
