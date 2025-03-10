import { rarelyChangingQueryOptions } from "@big-components/utils"
import { useQuery } from "@tanstack/react-query"
import { useCookies } from "react-cookie"

const useLoggedUserQuery = () => {
  const [cookies] = useCookies(["token"])

  return useQuery({
    queryKey: ["loggedUser"],
    queryFn: async () => {
      if (!cookies.token) return false

      return true
    },
    ...rarelyChangingQueryOptions,
  })
}

export default useLoggedUserQuery
