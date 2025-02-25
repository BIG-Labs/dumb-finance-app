import { useRouter } from "next/router"
import { useMemo } from "react"
import TokenPage from "components/pages/Token"

export default function Token() {
  const { query } = useRouter()

  const id = useMemo(() => Number(query.token), [query])

  return <TokenPage id={id} />
}
