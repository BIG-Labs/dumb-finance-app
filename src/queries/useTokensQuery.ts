import {
  fromChainAmount,
  rarelyChangingQueryOptions,
} from "@big-components/utils"
import { useQuery } from "@tanstack/react-query"
import { tokens } from "constants/utils"
import { useUser } from "providers/UserProvider"
import { Token } from "types/response"
import { createPublicClient, erc20Abi, Hex, http } from "viem"
import { avalancheFuji } from "viem/chains"

const useTokensQuery = () => {
  const { user } = useUser()

  return useQuery<Array<Token>>({
    queryKey: ["tokens"],
    queryFn: async () => {
      if (!user) {
        return []
      }

      const client = createPublicClient({
        chain: avalancheFuji,
        transport: http(),
      })

      const holder: Token[] = []

      for (const token of tokens) {
        if (token.address === "0x") {
          holder.push({
            ...token,
            balance: 0,
          })
          continue
        }

        const balance = await client.readContract({
          abi: erc20Abi,
          address: token.address as Hex,
          functionName: "balanceOf",
          args: [user.address],
        })

        holder.push({
          ...token,
          balance: fromChainAmount(Number(balance), token.decimals),
        })
      }

      return holder
    },
    ...rarelyChangingQueryOptions,
  })
}

export default useTokensQuery
