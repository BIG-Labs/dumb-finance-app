import { rarelyChangingQueryOptions } from "@big-components/utils"
import { useQuery } from "@tanstack/react-query"

const useCheckPlatformAvailability = () => {
  return useQuery({
    queryKey: ["checkPlatformAvailability"],
    queryFn: async () => {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()

      return available
    },
    ...rarelyChangingQueryOptions,
  })
}

export default useCheckPlatformAvailability
