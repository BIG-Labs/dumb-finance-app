import { useMutation } from "@tanstack/react-query"

const useSwap = () => {
  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))

      return true
    },
  })
}

export default useSwap
