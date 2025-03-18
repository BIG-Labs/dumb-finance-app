import { toHex, zeroAddress } from "viem";
import { UserOperation } from "viem/account-abstraction";

export const DEFAULT_CALL_GAS_LIMIT = BigInt(400_000);
export const DEFAULT_VERIFICATION_GAS_LIMIT = BigInt(2_000_000); // 2M
export const DEFAULT_PRE_VERIFICATION_GAS = BigInt(80_000); //65000

export const DEFAULT_USER_OP: UserOperation = {
  sender: zeroAddress,
  nonce: BigInt(0),
  initCode: toHex(new Uint8Array(0)),
  callData: toHex(new Uint8Array(0)),
  paymasterAndData: toHex(new Uint8Array(0)),
  signature: toHex(new Uint8Array(0)),
  maxFeePerGas: BigInt(0),
  maxPriorityFeePerGas: BigInt(0),
  callGasLimit: DEFAULT_CALL_GAS_LIMIT,
  preVerificationGas: DEFAULT_PRE_VERIFICATION_GAS,
  verificationGasLimit: DEFAULT_VERIFICATION_GAS_LIMIT,
} satisfies UserOperation;