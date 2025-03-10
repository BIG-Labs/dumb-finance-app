import { create } from "@github/webauthn-json"
import { useMutation } from "@tanstack/react-query"
import { clean } from "components/utils"
import config from "constants/config"
import { randomBytes } from "crypto"

interface RegisterParams {
  email: string
  username: string
}

const useRegister = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async ({ username, email }: RegisterParams) => {
      const challenge = clean(randomBytes(32).toString("base64"))

      const cred = await create({
        publicKey: {
          challenge,
          rp: {
            name: "WebAuthn Demo",
            id: window.location.hostname,
          },
          user: {
            id: crypto.randomUUID(),
            name: email,
            displayName: username,
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          timeout: 60000,
          attestation: "direct",
          authenticatorSelection: {
            requireResidentKey: true,
            residentKey: "required",
            userVerification: "required",
          },
        },
      })

      const res = await fetch(`${config.apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          challenge,
          credential: {
            id: cred.id,
            rawId: cred.rawId,
            response: cred.response,
            type: cred.type,
          },
        }),
      })

      if (res.status === 201) return res.json()

      throw new Error("Something went wrong")
    },
    onSuccess: () => onSuccess(),
  })
}

export default useRegister
