import { useMutation } from "@tanstack/react-query"
import config from "constants/config"
import {
  ROUTER_ABI,
  ROUTER_ADDRESS,
  tokenHomesAddress,
  tokenRemotesAddress,
} from "constants/factory"
import { UserOpBuilder } from "lib/smartWallet/builder"
import { ENTRYPOINT_ADDRESS } from "lib/smartWallet/entryPoint"
import { useUser } from "providers/UserProvider"
import { useState } from "react"
import {
  encodeAbiParameters,
  encodeFunctionData,
  erc20Abi,
  EstimateFeesPerGasReturnType,
  Hex,
  zeroAddress,
} from "viem"
import { entryPoint07Abi } from "viem/account-abstraction"
import { readContract } from "viem/actions"
import { avalanche } from "viem/chains"
import { usePublicClient } from "wagmi"

interface SwapProps {
  tokenIn: {
    address: Hex
    amount: bigint
    chainId: number
  }
  tokenOut: {
    address: Hex
    amount: bigint
    chainId: number
  }
}

const useSwap = () => {
  const { user } = useUser()
  const [builderOp] = useState(() => {
    return new UserOpBuilder({
      ...avalanche,
    })
  })

  const client = usePublicClient()

  return useMutation({
    mutationFn: async ({ tokenIn, tokenOut }: SwapProps) => {
      if (!user || !client) {
        return
      }

      const nonce = await readContract(client, {
        abi: entryPoint07Abi,
        address: ENTRYPOINT_ADDRESS,
        functionName: "getNonce",
        args: [user.address || zeroAddress, BigInt(0)],
      })

      const {
        maxFeePerGas,
        maxPriorityFeePerGas,
      }: EstimateFeesPerGasReturnType =
        await builderOp.publicClient.estimateFeesPerGas()

      const deadline = Date.parse("2030-01-01") / 1000

      const allowanceData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, tokenIn.amount],
      })

      const swapCall = encodeAbiParameters(
        [
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMin", type: "uint256" },
          { name: "path", type: "address[]" },
          { name: "to", type: "address" },
          { name: "deadline", type: "uint256" },
        ],
        [
          tokenIn.amount,
          BigInt(0),
          [tokenIn.address, tokenOut.address],
          user.address as Hex,
          BigInt(deadline),
        ]
      )

      const swapData = encodeFunctionData({
        abi: ROUTER_ABI,
        functionName: "start",
        args: [
          tokenIn.address,
          tokenIn.amount,
          {
            receiver: user.address as Hex,
            hops: [
              {
                action: 0,
                requiredGasLimit: BigInt(500000),
                recipientGasLimit: BigInt(250000),
                trade: swapCall,
                bridgePath: {
                  bridgeSourceChain: tokenHomesAddress[tokenOut.address] as Hex,
                  sourceBridgeIsNative: false,
                  bridgeDestinationChain: tokenRemotesAddress[tokenOut.address],
                  cellDestinationChain: zeroAddress,
                  destinationBlockchainID:
                    "0x898b8aa8353f2b79ee1de07c36474fcee339003d90fa06ea3a90d9e88b7d7c33",
                  teleporterFee: BigInt(0),
                  secondaryTeleporterFee: BigInt(0),
                },
              },
            ],
          },
          zeroAddress,
        ],
      })

      const { userOperation, userOpHash } = await builderOp.buildUserOp({
        nonce: nonce || BigInt(0),
        calls: [
          {
            data: allowanceData,
            to: tokenIn.address,
            value: BigInt(0),
          },
          {
            data: swapData,
            to: ROUTER_ADDRESS,
            value: BigInt(0),
          },
        ],
        maxFeePerGas: maxFeePerGas as bigint,
        maxPriorityFeePerGas: maxPriorityFeePerGas as bigint,
        account: user.address,
        keyId: user.keyId,
        publicKey: [user.publicKey.x, user.publicKey.y],
        salt: user.salt,
      })

      await fetch(`${config.apiUrl}/user/operation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(
          {
            ...userOperation,
            hash: userOpHash.toString(),
          },
          (_, v: unknown) => {
            if (typeof v === "bigint") return v.toString()
            return v
          }
        ),
      })
    },
  })
}

export default useSwap
