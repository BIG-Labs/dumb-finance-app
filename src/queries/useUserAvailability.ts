import { rarelyChangingQueryOptions } from "@big-components/utils"
import { useQuery } from "@tanstack/react-query"
import config from "constants/config"

interface CheckUserAvailabilityQueryParams {
  username: string
  email: string
}

const useUserAvailabilityQuery = ({
  email,
  username,
}: CheckUserAvailabilityQueryParams) => {
  return useQuery({
    queryKey: ["checkUserAvailability", { email, username }],
    queryFn: async () => {
      const res = await fetch(`${config.apiUrl}/auth/exists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username }),
      })

      if (res.status === 409) return false

      if (res.status === 201) return true

      throw new Error("Something went wrong")
    },
    ...rarelyChangingQueryOptions,
  })
}

export default useUserAvailabilityQuery
