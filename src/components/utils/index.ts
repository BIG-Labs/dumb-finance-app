export async function typifiedFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  return await res.json()
}

export const clean = (str: string): string => {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}