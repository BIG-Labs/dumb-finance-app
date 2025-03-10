import Auth from "components/common/Auth"
import Portfolio from "components/pages/Portfolio"
import { useUser } from "providers/UserProvider"
import { useEffect, useState } from "react"

export default function Home() {
  const { connected } = useUser()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (connected) {
      setLoading(false)
    }
  }, [connected])

  if (!loading && !connected) {
    return <Auth />
  }

  return <Portfolio />
}
