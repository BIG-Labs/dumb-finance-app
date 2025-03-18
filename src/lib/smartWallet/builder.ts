import {
  Chain,
  Hex,
  PublicClient,
  createPublicClient,
  encodeFunctionData,
  encodePacked,
  getContract,
  http,
  toHex,
  encodeAbiParameters,
  Call,
} from "viem"
import {
  PackedUserOperation,
  toPackedUserOperation,
  UserOperation,
} from "viem/account-abstraction"
import { ENTRYPOINT_ABI, ENTRYPOINT_ADDRESS } from "./entryPoint"
import { WebAuthn } from "lib/web-auth"
import { FACTORY_ABI, FACTORY_ADDRESS } from "constants/factory"
import { DEFAULT_USER_OP } from "./constants"

export class UserOpBuilder {
  public relayer: Hex = "0x02FD9aD3b0623e36e84c3a0F8e1D81c3bbc155b1"
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
    nonce,
  }: {
    calls: Call[]
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
    account: Hex
    keyId: Hex
    publicKey: readonly [Hex, Hex]
    salt: Hex
    nonce: bigint
  }): Promise<{ userOperation: PackedUserOperation; userOpHash: Hex }> {
    // create callData
    const callData = this._addCallData(calls)

    const bytecode = await this.publicClient.getCode({
      address: account,
    })

    let initCode = undefined
    let initCodeGas = BigInt(0)

    if (bytecode === undefined) {
      // smart wallet does NOT already exists
      // calculate initCode and initCodeGas
      ;({ initCode, initCodeGas } = await this._createInitCode(publicKey, salt))
    }

    // create user operation
    const userOp = {
      ...DEFAULT_USER_OP,
      sender: account,
      nonce,
      callData,
      maxFeePerGas,
      maxPriorityFeePerGas,
      factory: FACTORY_ADDRESS,
      factoryData: initCode,
    }

    // TODO estimate callGasLimit, verificationGasLimit, preVerificationGas
    userOp.verificationGasLimit += BigInt(initCodeGas) + BigInt(1_000_000)

    const op = toPackedUserOperation(userOp as UserOperation)

    // get userOp hash (with signature == 0x) by calling the entry point contract
    const userOpHash = await this._getUserOpHash(op)

    // version = 1 and validUntil = 0 in msgToSign are hardcoded
    const msgToSign = encodePacked(
      ["uint8", "uint48", "bytes32"],
      [1, 0, userOpHash]
    )

    // get signature from webauthn
    const signature = await this.getSignature(msgToSign, keyId)

    return {
      userOperation: {
        ...op,
        signature,
      },
      userOpHash,
    }
  }

  public async getSignature(msgToSign: Hex, keyId: Hex): Promise<Hex> {
    const { credential, metadata, signature } = await WebAuthn.get(msgToSign)
    const id = toHex(new Uint8Array(Buffer.from(credential.id, "base64")))

    if (id !== keyId) {
      throw new Error(
        "Incorrect passkeys used for tx signing. Please sign the transaction with the correct logged-in account"
      )
    }

    const sig = encodePacked(
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
              authenticatorData: metadata.authenticatorData,
              clientDataJSON: metadata.clientDataJSON,
              challengeLocation: BigInt(23),
              responseTypeLocation: BigInt(1),
              r: signature.r,
              s: signature.s,
            },
          ]
        ),
      ]
    )

    return sig
  }

  private _addCallData(calls: Call[]): Hex {
    const formattedCalls = calls.map((call) => ({
      to: call.to,
      value: call.value ?? BigInt(0),
      data: call.data ?? "0x",
    }))

    return encodeFunctionData({
      abi: [
        {
          inputs: [
            {
              components: [
                {
                  internalType: "address",
                  name: "to",
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
      args: [formattedCalls],
    })
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

    const initCodeGas = await this.publicClient.estimateGas({
      account: this.relayer,
      to: FACTORY_ADDRESS,
      data,
    })

    return {
      initCode: data,
      initCodeGas,
    }
  }
}
