import { Hex } from "viem"

export type P256Credential = {
  rawId: Hex
  clientData: {
    type: string
    challenge: string
    origin: string
    crossOrigin: boolean
  }
  authenticatorData: Hex
  signature: P256Signature
}

export type P256Signature = {
  r: bigint
  s: bigint
}
