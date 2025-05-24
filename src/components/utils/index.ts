const typifiedFetch = async <T>(
  url: string | URL,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(url, init)

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Fetch error ${res.status}: ${errorText}`)
  }

  return await res.json()
}

const clean = (str: string): string => {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

const assertValue = <T>(value: T | undefined | null, fallback?: T): T => {
  if (value != null) return value
  if (fallback != null) return fallback

  throw new Error("Expected a value or fallback, but got none.")
}

export { typifiedFetch, clean, assertValue }
