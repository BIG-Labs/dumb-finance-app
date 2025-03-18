import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CookiesProvider } from "react-cookie"
import UserProvider from "./UserProvider"
import WagmiProvider from "./WagmiProvider"

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <UserProvider>{children}</UserProvider>
        </CookiesProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}

export default Providers
