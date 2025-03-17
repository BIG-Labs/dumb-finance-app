import { PackedUserOperation } from "./types"
import { Hex, toHex, zeroAddress } from "viem"
import { hexlify, hexZeroPad, hexConcat } from "@ethersproject/bytes"

export const DEFAULT_CALL_GAS_LIMIT = BigInt(200_000)
export const DEFAULT_VERIFICATION_GAS_LIMIT = BigInt(20_000_000) // 2M
export const DEFAULT_PRE_VERIFICATION_GAS = BigInt(800_000) //65000

export const DEFAULT_USER_OP: PackedUserOperation = {
  sender: zeroAddress,
  nonce: BigInt(0),
  initCode: toHex(new Uint8Array(0)),
  callData: toHex(new Uint8Array(0)),
  accountGasLimits: packAccountGasLimits(
    DEFAULT_VERIFICATION_GAS_LIMIT,
    DEFAULT_CALL_GAS_LIMIT
  ),
  preVerificationGas: DEFAULT_PRE_VERIFICATION_GAS,
  gasFees: toHex(new Uint8Array(0)),
  paymasterAndData: toHex(new Uint8Array(0)),
  signature: toHex(new Uint8Array(0)),
}

export const emptyHex = toHex(new Uint8Array(0))

export function packAccountGasLimits(
  verificationGasLimit: bigint,
  callGasLimit: bigint
): Hex {
  return hexConcat([
    hexZeroPad(hexlify(verificationGasLimit, { hexPad: "left" }), 16),
    hexZeroPad(hexlify(callGasLimit, { hexPad: "left" }), 16),
  ]) as Hex
}
