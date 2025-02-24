import { rarelyChangingQueryOptions } from "@big-components/utils"
import { useQuery } from "@tanstack/react-query"
import { tokens } from "constants/utils"
import { Token } from "types/response"

const useTokensQuery = () => {
  return useQuery<Array<Token>>({
    queryKey: ["tokens"],
    queryFn: async () => {
      const promise = new Promise<Array<Token>>((resolve) => {
        setTimeout(() => {
          resolve(tokens)
        }, 1000)
      })

      return promise
    },
    ...rarelyChangingQueryOptions,
  })
}

export default useTokensQuery
