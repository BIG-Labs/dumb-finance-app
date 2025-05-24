import { Center } from "@big-components/ui"
import Auth from "components/common/Auth"
import Portfolio from "components/pages/Portfolio"
import { DinoLoader } from "components/utils/ui"
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
        <DinoLoader text fill="var(--unifi-primary)" width={125} height={125} />
      </Center>
    )
  }

  return connected ? <Portfolio /> : <Auth />
}
