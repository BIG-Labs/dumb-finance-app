import { Center } from "@big-components/ui"
import Auth from "components/common/Auth"
import Portfolio from "components/pages/Portfolio"
import { Spinner } from "components/utils/ui"
import { useUser } from "providers/UserProvider"
import { useState, useEffect } from "react"

export default function Home() {
  const { connected, loading } = useUser()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <Center
        style={{
          minHeight: "70vh",
        }}
      >
        <Spinner />
      </Center>
    )
  }

  return connected ? <Portfolio /> : <Auth />
}
