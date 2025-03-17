import { useMutation } from "@tanstack/react-query"
import config from "constants/config"
import { TRADERJOE_ABI, TRADERJOE_ROUTER_ADDRESS } from "constants/factory"
import { UserOpBuilder } from "lib/smartWallet/builder"
import { useUser } from "providers/UserProvider"
import { useState } from "react"
import {
  encodeFunctionData,
  erc20Abi,
  EstimateFeesPerGasReturnType,
  Hex,
} from "viem"
import { avalancheFuji } from "viem/chains"

interface SwapProps {
  tokenIn: {
    address: Hex
    amount: number
  }
  tokenOut: {
    address: Hex
    amount: number
  }
}

const useSwap = () => {
  const { user } = useUser()
  const [builderOp] = useState(() => {
    return new UserOpBuilder({
      ...avalancheFuji,
    })
  })

  return useMutation({
    mutationFn: async ({ tokenIn, tokenOut }: SwapProps) => {
      if (!user) {
        return
      }

      const {
        maxFeePerGas,
        maxPriorityFeePerGas,
      }: EstimateFeesPerGasReturnType =
        await builderOp.publicClient.estimateFeesPerGas()

      const tenMinutesFromNow = Math.floor(Date.now() / 1000) + 600

      const allowanceData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [TRADERJOE_ROUTER_ADDRESS, BigInt(tokenIn.amount)],
      })

      const data = encodeFunctionData({
        abi: TRADERJOE_ABI,
        functionName: "swapExactTokensForTokens",
        args: [
          BigInt(tokenIn.amount),
          BigInt(0),
          {
            pairBinSteps: [BigInt(10)],
            tokenPath: [tokenIn.address, tokenOut.address],
            versions: [1],
          },
          user.address,
          BigInt(tenMinutesFromNow),
        ],
      })

      const { userOperation, userOpHash } = await builderOp.buildUserOp({
        calls: [
          {
            data: allowanceData,
            dest: tokenIn.address,
            value: BigInt(0),
          },
          {
            data,
            dest: TRADERJOE_ROUTER_ADDRESS,
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

      return true
    },
  })
}

export default useSwap
