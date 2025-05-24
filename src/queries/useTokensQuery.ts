import { fromChainAmount } from "@big-components/utils"
import { useQuery } from "@tanstack/react-query"
import { tokens } from "constants/utils"
import { useUser } from "providers/UserProvider"
import { chains } from "providers/WagmiProvider"
import { Token } from "types/response"
import { createPublicClient, erc20Abi, http } from "viem"
import { avalanche } from "viem/chains"

const useTokensQuery = () => {
  const { user } = useUser()

  return useQuery<Array<Token & { balance: number }>>({
    queryKey: ["tokens", user, tokens],
    queryFn: async () => {
      if (!user) {
        return []
      }

      const holder: Array<Token & { balance: number }> = []

      const avaClient = createPublicClient({
        chain: avalanche,
        transport: http(),
      })

      const coqClient = createPublicClient({
        chain: chains[1],
        transport: http(),
      })

      const avaBalance = await avaClient.readContract({
        abi: erc20Abi,
        address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        functionName: "balanceOf",
        args: [user.address],
      })

      const coqBalance = await coqClient.readContract({
        abi: erc20Abi,
        address: "0x1BB241dF1B33a9A5CABB63d81Ef0485c17aa0EB3",
        functionName: "balanceOf",
        args: [user.address],
      })

      holder.push({
        ...tokens[0],
        balance: fromChainAmount(avaBalance.toString(), 18),
      })

      holder.push({
        ...tokens[1],
        balance: fromChainAmount(coqBalance.toString(), 6),
      })

      return holder
    },
  })
}

export default useTokensQuery
