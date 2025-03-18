import crypto from "crypto"
import { Hex, toHex } from "viem"
import { Signature, WebAuthnP256 } from "ox"
import { SignMetadata } from "ox/WebAuthnP256"

export class WebAuthn {
  private static _generateRandomBytes(): Buffer {
    return crypto.randomBytes(16)
  }

  public static isSupportedByBrowser(): boolean {
    return (
      window?.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential === "function"
    )
  }

  public static async platformAuthenticatorIsAvailable(): Promise<boolean> {
    if (
      !this.isSupportedByBrowser() &&
      typeof window.PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable !== "function"
    ) {
      return false
    }
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
  }

  public static async isConditionalSupported(): Promise<boolean> {
    if (
      !this.isSupportedByBrowser() &&
      typeof window.PublicKeyCredential.isConditionalMediationAvailable !==
        "function"
    ) {
      return false
    }
    return await PublicKeyCredential.isConditionalMediationAvailable()
  }

  public static async isConditional() {
    if (
      typeof window.PublicKeyCredential !== "undefined" &&
      typeof window.PublicKeyCredential.isConditionalMediationAvailable ===
        "function"
    ) {
      const available =
        await PublicKeyCredential.isConditionalMediationAvailable()

      if (available) {
        this.get()
      }
    }
  }

  public static async create({
    email,
    username,
  }: {
    username: string
    email: string
  }): Promise<{ credential: Credential | null; challenge: string }> {
    this.isSupportedByBrowser()

    const challenge = Uint8Array.from(
      crypto.randomBytes(32).toString("hex"),
      (c) => c.charCodeAt(0)
    )

    const options: PublicKeyCredentialCreationOptions = {
      timeout: 60000,
      rp: {
        name: "WebAuthn Demo",
        id: window.location.hostname,
      },
      user: {
        id: this._generateRandomBytes(),
        name: email,
        displayName: username,
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" }, // ES256
      ],
      authenticatorSelection: {
        requireResidentKey: true,
        userVerification: "required",
        authenticatorAttachment: "platform",
      },
      attestation: "direct",
      challenge,
    }

    const credential = await navigator.credentials.create({
      publicKey: options,
    })

    return {
      credential,
      challenge: clean(challenge),
    }
  }

  public static async get(challenge?: Hex): Promise<{
    credential: Credential
    challenge: string
    metadata: SignMetadata
    signature: Signature.Signature<false>
  }> {
    this.isSupportedByBrowser()

    const ch = challenge
      ? Buffer.from(challenge.slice(2), "hex")
      : Uint8Array.from(crypto.randomBytes(32).toString("hex"), (c) =>
          c.charCodeAt(0)
        )

    const { metadata, raw, signature } = await WebAuthnP256.sign({
      challenge: toHex(ch),
      rpId: window.location.hostname,
      userVerification: "required",
    })

    return {
      credential: raw,
      metadata,
      signature,
      challenge: clean(ch),
    }
  }
}

export function clean(challenge: Uint8Array): string {
  const b64 = Buffer.from(challenge).toString("base64")
  return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}
