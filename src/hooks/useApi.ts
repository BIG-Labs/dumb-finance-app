import { capitalizeFirstLetter } from "@big-components/utils"
import { typifiedFetch } from "components/utils"
import { useCallback } from "react"
import { apiURL, EndpointOptions, endpoints, Endpoints } from "types/interface"

type ApiCallOptions<T extends Endpoints> = {
  headers?: Record<string, string>
} & Omit<EndpointOptions[T], "response">

export const useApi = () => {
  const api = useCallback(
    async <T extends Endpoints>(
      endpoint: T,
      options: ApiCallOptions<T>
    ): Promise<EndpointOptions[T]["response"]> => {
      const url = new URL(apiURL + endpoints[endpoint])

      if (options.method === "GET" && options.query) {
        Object.entries(options.query).forEach(([key, value]) => {
          url.searchParams.set(key, String(value))
        })
      }

      let body = undefined

      if (options.method !== "GET" && "body" in options) {
        body = JSON.stringify(options.body)
      }

      try {
        return await typifiedFetch<EndpointOptions[T]["response"]>(
          url.toString(),
          {
            method: options.method,
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
            body,
            credentials: "include",
          }
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error"
        throw new Error(`${capitalizeFirstLetter(endpoint)} failed: ${message}`)
      }
    },
    []
  )

  return api
}
