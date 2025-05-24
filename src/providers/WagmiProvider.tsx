import { ReactNode, useState } from "react"
import { Chain, defineChain } from "viem"
import { avalanche } from "viem/chains"
import { createConfig, http, WagmiProvider as Provider } from "wagmi"

const coqNet = defineChain({
  id: 42_069,
  name: "coqNet",
  nativeCurrency: {
    name: "Coq Inu",
    symbol: "COQ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://subnets.avax.network/coqnet/mainnet/rpc"],
    },
  },
})

export const chains: [Chain, ...Chain[]] = [avalanche, coqNet]

const WagmiProvider = ({ children }: { children: ReactNode }) => {
  const [config] = useState(
    createConfig({
      chains,
      transports: {
        [avalanche.id]: http(),
      },
    })
  )

  return <Provider config={config}>{children}</Provider>
}

export default WagmiProvider
