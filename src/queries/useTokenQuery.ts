import { rarelyChangingQueryOptions } from "@big-components/utils"
import { useQuery } from "@tanstack/react-query"
import { tokens } from "constants/utils"
import { Token } from "types/response"

const useTokenQuery = (id: number) => {
  return useQuery({
    queryKey: ["token", id],
    queryFn: async () => {
      const promise = new Promise<Token>((resolve) => {
        setTimeout(() => {
          resolve(tokens.find((token) => token.id === id) as Token)
        }, 1000)
      })

      return promise
    },
    ...rarelyChangingQueryOptions,
  })
}

export default useTokenQuery
