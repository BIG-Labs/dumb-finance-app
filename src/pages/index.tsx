import Auth from "components/common/Auth"
import Portfolio from "components/pages/Portfolio"
import { useUser } from "providers/UserProvider"
import { useState, useEffect } from "react"

export default function Home() {
  const { connected } = useUser()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return connected ? <Portfolio /> : <Auth />
}
