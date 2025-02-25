export type Token = {
  id: number
  address: string
  icon: string
  name: string
  symbol: string
  price: number
  decimals: number
  percentChange: number
  balance: number
  tvl: number
  apr: number
  prices: Array<Array<number>>
}
