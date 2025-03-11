type EnvVar = "apiUrl" | "isProduction"

const getEnvDefault = (
  value: string | undefined,
  defaultValue: string
): string => {
  return value || defaultValue
}

const config = {
  apiUrl: getEnvDefault(process.env.NEXT_PUBLIC_API_URL, ""),
  isProduction: process.env.NEXT_PUBLIC_NODE_ENV === "production",
}

const required: EnvVar[] = ["apiUrl"]

const descriptions: Record<EnvVar, string[]> = {
  apiUrl: ["Api URL", "NEXT_PUBLIC_API_URL"],
  isProduction: ["Production flag", "NEXT_PUBLIC_NODE_ENV"],
}

for (const r of required) {
  if (!config[r] || config[r] === "")
    throw new Error(
      `Missing ${descriptions[r][0]}. Please set ${descriptions[r][1]} env variable`
    )
}

export default config
