import { get } from "@github/webauthn-json"
import { useMutation } from "@tanstack/react-query"
import { clean } from "components/utils"
import config from "constants/config"
import { randomBytes } from "crypto"
import { jwtDecode } from "jwt-decode"
import { useCookies } from "react-cookie"

interface LoginParams {
  email: string
}

const useLogin = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookies] = useCookies(["token", "refreshToken"])

  return useMutation({
    mutationFn: async ({ email }: LoginParams) => {
      const challenge = clean(randomBytes(32).toString("base64"))

      const cred = await get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
          rpId: window.location.hostname,
        },
      })

      const res = await fetch(`${config.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          challenge,
          credential: {
            id: cred.id,
            rawId: cred.rawId,
            response: cred.response,
            type: cred.type,
          },
        }),
      })

      if (res.status === 201) {
        const { accessToken, refreshToken } = await res.json()

        const { exp } = jwtDecode(accessToken)

        const { exp: refreshExp } = jwtDecode(refreshToken)

        if (!exp || !refreshExp) throw new Error("Token has no expiration date")

        setCookies("token", accessToken, {
          expires: new Date(exp * 1000),
        })

        setCookies("refreshToken", refreshToken, {
          expires: new Date(refreshExp * 100),
        })

        return true
      }

      throw new Error("Something went wrong")
    },
  })
}

export default useLogin
