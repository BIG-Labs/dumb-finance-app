import config from "constants/config"
import { jwtDecode } from "jwt-decode"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useCookies } from "react-cookie"
import { User } from "types/user"

interface UserContext {
  connected: boolean
  user: User | null
  connect: (token: string) => void
  disconnect: () => void
  loading: boolean
}

const Context = createContext<UserContext>({
  connected: false,
  user: null,
  connect: () => {},
  disconnect: () => {},
  loading: true,
})

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [{ token, refreshToken }, setCookies, removeCookies] = useCookies([
    "token",
    "refreshToken",
  ])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const disconnect = useCallback(() => {
    return removeCookies("token")
  }, [removeCookies])

  const connect = useCallback(
    (token: string) => {
      return setCookies("token", token)
    },
    [setCookies]
  )

  const connectedUser = useMemo(() => {
    if (!token) return null

    const user = jwtDecode<User>(token)

    return {
      ...user,
      token,
    }
  }, [token])

  const connected = useMemo(() => !!user, [user])

  useEffect(() => {
    setUser(connectedUser)
  }, [connectedUser])

  const refresh = useCallback(async () => {
    if (!user) return

    try {
      const res = await fetch(`${config.apiUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: refreshToken,
        }),
      })

      if (res.status === 201) {
        const { accessToken, refreshToken } = await res.json()

        const { exp } = jwtDecode(accessToken)

        const { exp: refreshExp } = jwtDecode(refreshToken)

        if (!exp || !refreshExp) throw new Error("Token has no expiration date")

        setCookies("token", accessToken, {
          expires: new Date(exp * 1000),
        })

        setCookies("refreshToken", refreshToken, {
          expires: new Date(refreshExp * 1000),
        })
      }
    } catch {
      disconnect()
    }

    setLoading(false)
  }, [disconnect, refreshToken, setCookies, token, user])

  useEffect(() => {
    const expiresSoon = !!user && user.exp * 1000 - Date.now() < 60_000

    if (expiresSoon) {
      refresh()
    } else {
      setLoading(false)
    }
  }, [refresh, token, user])

  const value = useMemo(
    () => ({
      loading,
      token,
      user,
      connected,
      connect,
      disconnect,
    }),
    [loading, token, user, connected, connect, disconnect]
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
