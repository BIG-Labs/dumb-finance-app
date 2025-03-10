import { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CookiesProvider } from "react-cookie"
import UserProvider from "./UserProvider"

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <UserProvider>{children}</UserProvider>
      </CookiesProvider>
    </QueryClientProvider>
  )
}

export default Providers
