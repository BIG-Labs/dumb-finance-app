import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CookiesProvider } from "react-cookie"
import UserProvider from "./UserProvider"
import WagmiProvider from "./WagmiProvider"
import { rarelyChangingQueryOptions } from "@big-components/utils"

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            ...rarelyChangingQueryOptions,
            retry: 1,
          },
        },
      })
  )

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
