import { jwtDecode } from "jwt-decode"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react"
import { useCookies } from "react-cookie"

const Context = createContext<{
  connected: boolean
  user: {
    exp: number
    iat: number
    keyId: string
    userId: number
    username: string
  } | null
  connect: (token: string) => void
  disconnect: () => void
}>({
  connected: false,
  user: null,
  connect: () => {},
  disconnect: () => {},
})

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [{ token }, setCookies, removeCookies] = useCookies(["token"])

  const disconnect = useCallback(() => {
    return removeCookies("token")
  }, [removeCookies])

  const connect = useCallback(
    (token: string) => {
      return setCookies("token", token)
    },
    [setCookies]
  )

  const user = useMemo(() => {
    if (!token) return null

    const user: {
      exp: number
      iat: number
      keyId: string
      userId: number
      username: string
    } = jwtDecode(token)

    return user
  }, [token])

  const connected = useMemo(() => !!token, [token])

  const value = useMemo(
    () => ({
      user,
      connected,
      connect,
      disconnect,
    }),
    [user, connected, connect, disconnect]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default UserProvider

export const useUser = () => {
  const context = useContext(Context)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
