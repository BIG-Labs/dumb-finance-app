import { Hex } from "viem"

export type User = {
  address: Hex
  exp: number
  iat: number
  keyId: Hex
  userId: number
  username: string
  salt: Hex
  publicKey: {
    x: Hex
    y: Hex
  }
  token: string
}
