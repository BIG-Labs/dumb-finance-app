import {
  Chain,
  Hex,
  PublicClient,
  createPublicClient,
  encodeFunctionData,
  encodePacked,
  getContract,
  http,
  parseAbi,
  toHex,
  encodeAbiParameters,
  zeroAddress,
} from "viem"
import { Call, PackedUserOperation } from "./types"
import {
  DEFAULT_CALL_GAS_LIMIT,
  DEFAULT_USER_OP,
  DEFAULT_VERIFICATION_GAS_LIMIT,
  packAccountGasLimits,
} from "./constants"
import { FACTORY_ABI, FACTORY_ADDRESS } from "constants/factory"
import { ENTRYPOINT_ABI, ENTRYPOINT_ADDRESS } from "./entryPoint"
import { P256Credential } from "lib/web-auth/types"
import { WebAuthn } from "lib/web-auth"

export class UserOpBuilder {
  public relayer: Hex = "0xDC78317f21EEefeE554F2c0F28CEbfa87e4c5BF5"
  public entryPoint: Hex = ENTRYPOINT_ADDRESS
  public chain: Chain
  public publicClient: PublicClient

  constructor(chain: Chain) {
    this.chain = chain
    this.publicClient = createPublicClient({
      chain,
      transport: http(),
    })
  }
  
  // reference: https://ethereum.stackexchange.com/questions/150796/how-to-create-a-raw-erc-4337-useroperation-from-scratch-and-then-send-it-to-bund
  async buildUserOp({
    calls,
    maxFeePerGas,
    maxPriorityFeePerGas,
    account,
    keyId,
    publicKey,
    salt,
  }: {
    calls: Call[]
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
    account: Hex
    keyId: Hex
    publicKey: readonly [Hex, Hex]
    salt: Hex
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<{ userOperation: any; userOpHash: Hex }> {
    // calculate nonce
    const nonce = await this._getNonce(account)

    // create callData
    const callData = this._addCallData(calls)

    const gasFees = packAccountGasLimits(maxPriorityFeePerGas, maxFeePerGas)

    const bytecode = await this.publicClient.getCode({
      address: account,
    })

    let initCode = toHex(new Uint8Array(0))
    let initCodeGas = BigInt(0)
    if (bytecode === undefined) {
      // smart wallet does NOT already exists
      // calculate initCode and initCodeGas
      ;({ initCode, initCodeGas } = await this._createInitCode(publicKey, salt))
    }

    // create user operation
    const op: PackedUserOperation = {
      ...DEFAULT_USER_OP,
      sender: account,
      nonce,
      initCode,
      callData,
      gasFees,
      accountGasLimits: packAccountGasLimits(
        DEFAULT_VERIFICATION_GAS_LIMIT + initCodeGas,
        DEFAULT_CALL_GAS_LIMIT
      ),
    }

    // get userOp hash (with signature == 0x) by calling the entry point contract
    const userOpHash = await this._getUserOpHash(op)

    // version = 1 and validUntil = 0 in msgToSign are hardcoded
    const msgToSign = encodePacked(
      ["uint8", "uint48", "bytes32"],
      [1, 0, userOpHash]
    )

    // get signature from webauthn
    const signature = await this.getSignature(msgToSign, keyId)

    const userOp = {
      sender: op.sender,
      nonce: toHex(op.nonce),
      initCode: op.initCode,
      callData: op.callData,
      accountGasLimits: op.accountGasLimits,
      preVerificationGas: op.preVerificationGas,
      gasFees: op.gasFees,
      paymasterAndData:
        op.paymasterAndData === zeroAddress ? "0x" : op.paymasterAndData,
      signature,
    }

    return {
      userOperation: {
        ...userOp,
      },
      userOpHash,
    }
  }

  public async getSignature(msgToSign: Hex, keyId: Hex): Promise<Hex> {
    const { p256Credential } = await WebAuthn.get(msgToSign)
    const credentials = p256Credential as P256Credential

    if (p256Credential.rawId !== keyId) {
      throw new Error(
        "Incorrect passkeys used for tx signing. Please sign the transaction with the correct logged-in account"
      )
    }

    const signature = encodePacked(
      ["uint8", "uint48", "bytes"],
      [
        1,
        0,
        encodeAbiParameters(
          [
            {
              type: "tuple",
              name: "credentials",
              components: [
                {
                  name: "authenticatorData",
                  type: "bytes",
                },
                {
                  name: "clientDataJSON",
                  type: "string",
                },
                {
                  name: "challengeLocation",
                  type: "uint256",
                },
                {
                  name: "responseTypeLocation",
                  type: "uint256",
                },
                {
                  name: "r",
                  type: "uint256",
                },
                {
                  name: "s",
                  type: "uint256",
                },
              ],
            },
          ],
          [
            {
              authenticatorData: credentials.authenticatorData,
              clientDataJSON: JSON.stringify(credentials.clientData),
              challengeLocation: BigInt(23),
              responseTypeLocation: BigInt(1),
              r: credentials.signature.r,
              s: credentials.signature.s,
            },
          ]
        ),
      ]
    )

    return signature
  }

  private _addCallData(calls: Call[]): Hex {
    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "dest",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
                {
                  internalType: "bytes",
                  name: "data",
                  type: "bytes",
                },
              ],
              internalType: "struct Call[]",
              name: "calls",
              type: "tuple[]",
            },
          ],
          name: "executeBatch",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      functionName: "executeBatch",
      args: [calls],
    })
  }

  private async _getNonce(smartWalletAddress: Hex): Promise<bigint> {
    const nonce: bigint = await this.publicClient.readContract({
      address: this.entryPoint,
      abi: parseAbi([
        "function getNonce(address, uint192) view returns (uint256)",
      ]),
      functionName: "getNonce",
      args: [smartWalletAddress, BigInt(0)],
    })
    return nonce
  }

  private async _getUserOpHash(userOp: PackedUserOperation): Promise<Hex> {
    const entryPointContract = getContract({
      address: this.entryPoint,
      abi: ENTRYPOINT_ABI,
      client: this.publicClient,
    })

    const userOpHash = entryPointContract.read.getUserOpHash([userOp])
    return userOpHash
  }

  private async _createInitCode(
    pubKey: readonly [Hex, Hex],
    salt: Hex
  ): Promise<{ initCode: Hex; initCodeGas: bigint }> {
    const data = encodeFunctionData({
      abi: FACTORY_ABI,
      functionName: "createAccount",
      args: [pubKey, salt],
    })

    const initCode = encodePacked(
      ["address", "bytes"], // types
      [FACTORY_ADDRESS, data] // values
    )

    const initCodeGas = await this.publicClient.estimateGas({
      account: this.relayer,
      to: FACTORY_ADDRESS,
      data,
    })

    return {
      initCode,
      initCodeGas,
    }
  }
}
