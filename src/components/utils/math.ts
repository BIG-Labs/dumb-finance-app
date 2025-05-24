const assertNumber = (value?: string | number, fallback?: number): number => {
  const num = Number(value)

  if (isNaN(num)) {
    if (fallback) return fallback

    return 0
  }

  return num
}

const toUSD = (number?: number | string, decimals: number = 2) => {
  const num = assertNumber(number)

  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  })
}

const assertNumberTooSmall = (
  value?: string | number,
  threshold: number = 0.01,
  decimals: number = 2,
  usd?: boolean
): number | string => {
  const num = assertNumber(value)

  if (num === 0) return 0

  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...(usd && {
      style: "currency",
      currency: "USD",
      currencyDisplay: "symbol",
    }),
  }

  if (num < threshold) {
    return `< ${threshold.toLocaleString("en-US", formatOptions)}`
  }

  return num.toLocaleString("en-US", formatOptions)
}

export { assertNumber, toUSD, assertNumberTooSmall }
