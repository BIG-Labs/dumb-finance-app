import { randomBytes } from "crypto"
import { Hex, toHex } from "viem"
import { P256Credential, P256Signature } from "./types"
import { AsnParser } from "@peculiar/asn1-schema"
import { ECDSASigValue } from "@peculiar/asn1-ecc"

export class WebAuthn {
  public static isSupportedByBrowser(): boolean {
    return (
      window?.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential === "function"
    )
  }

  public static async get(challenge?: Hex): Promise<{
    credential: Credential | null
    challenge: string
    p256Credential: P256Credential
  }> {
    this.isSupportedByBrowser()

    const ch = challenge
      ? Buffer.from(challenge.slice(2), "hex")
      : Uint8Array.from(randomBytes(32).toString("hex"), (c) => c.charCodeAt(0))

    const options: PublicKeyCredentialRequestOptions = {
      timeout: 60000,
      challenge: ch,
      rpId: window.location.hostname,
      userVerification: "preferred",
    } as PublicKeyCredentialRequestOptions

    const credential = await navigator.credentials.get({
      publicKey: options,
    })

    const cred = credential as unknown as {
      rawId: ArrayBuffer
      response: {
        clientDataJSON: ArrayBuffer
        authenticatorData: ArrayBuffer
        signature: ArrayBuffer
        userHandle: ArrayBuffer
      }
    }

    const utf8Decoder = new TextDecoder("utf-8")

    const decodedClientData = utf8Decoder.decode(cred.response.clientDataJSON)
    const clientDataObj = JSON.parse(decodedClientData)

    const authenticatorData = toHex(
      new Uint8Array(cred.response.authenticatorData)
    )
    const signature = parseSignature(new Uint8Array(cred?.response?.signature))

    const p256Credential: P256Credential = {
      rawId: toHex(new Uint8Array(cred.rawId)),
      clientData: {
        type: clientDataObj.type,
        challenge: clientDataObj.challenge,
        origin: clientDataObj.origin,
        crossOrigin: clientDataObj.crossOrigin,
      },
      authenticatorData,
      signature,
    }

    return {
      credential,
      challenge: clean(ch),
      p256Credential,
    }
  }
}

export function parseSignature(signature: Uint8Array): P256Signature {
  const parsedSignature = AsnParser.parse(signature, ECDSASigValue)
  let rBytes = new Uint8Array(parsedSignature.r)
  let sBytes = new Uint8Array(parsedSignature.s)

  if (shouldRemoveLeadingZero(rBytes)) {
    rBytes = rBytes.slice(1)
  }
  if (shouldRemoveLeadingZero(sBytes)) {
    sBytes = sBytes.slice(1)
  }
  const finalSignature = concatUint8Arrays([rBytes, sBytes])
  return {
    r: BigInt(toHex(finalSignature.slice(0, 32))),
    s: BigInt(toHex(finalSignature.slice(32))),
  }
}

export function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  let pointer = 0
  const totalLength = arrays.reduce((prev, curr) => prev + curr.length, 0)

  const toReturn = new Uint8Array(totalLength)

  arrays.forEach((arr) => {
    toReturn.set(arr, pointer)
    pointer += arr.length
  })

  return toReturn
}

export function shouldRemoveLeadingZero(bytes: Uint8Array): boolean {
  return bytes[0] === 0x0 && (bytes[1] & (1 << 7)) !== 0
}

export function clean(challenge: Uint8Array): string {
  const b64 = Buffer.from(challenge).toString("base64")
  return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}
