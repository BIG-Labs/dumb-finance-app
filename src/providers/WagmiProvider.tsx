import { ReactNode, useState } from "react"
import { avalancheFuji } from "viem/chains"
import { createConfig, http, WagmiProvider as Provider } from "wagmi"

const WagmiProvider = ({ children }: { children: ReactNode }) => {
  const [config] = useState(
    createConfig({
      chains: [avalancheFuji],
      transports: {
        [avalancheFuji.id]: http(),
      },
    })
  )

  return <Provider config={config}>{children}</Provider>
}

export default WagmiProvider
