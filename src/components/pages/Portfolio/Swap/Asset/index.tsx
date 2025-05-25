import { HStack, ChevronDownIcon, VStack } from "@big-components/ui"
import { CoinIcon } from "assets"
import { useMemo, Fragment, useCallback } from "react"
import { Img } from "react-image"
import Skeleton from "react-loading-skeleton"
import { Token } from "types/response"
import styles from "./Asset.module.scss"

interface AssetProps {
  setAmount: (amount: number) => void
  onOpen: () => void
  amount?: number
  token?: Token & { balance: number }
  from?: Token
}

const Asset = ({ amount, setAmount, token, from, onOpen }: AssetProps) => {
  const output = useMemo(() => {
    if (!token || !amount) return 0

    if (!!from) {
      return amount * from.price
    }

    return amount * token.price
  }, [amount, from, token])

  const value = useMemo(() => {
    if (!!from && !!token) {
      return output / token.price
    }

    return amount
  }, [amount, from, output, token])

  const handleAmount = useCallback(
    (value: number) => {
      const balance = token?.balance || 0

      if ((amount ?? 0) > balance) {
        setAmount(token?.balance || 0)
        return
      }

      if (value < 0) {
        setAmount(0)
        return
      }

      if (value > balance) {
        setAmount(balance || 0)
        return
      }

      setAmount(value)
    },
    [amount, setAmount, token]
  )

  return (
    <div className={styles.asset}>
      <HStack fullWidth alignItems="center" justifyContent="space-between">
        {!token ? (
          <Fragment>
            <Skeleton width={70} height={25} />
            <Skeleton width={70} height={25} />
          </Fragment>
        ) : (
          <Fragment>
            <button className={styles.token} onClick={onOpen}>
              <Img
                src={token.icon}
                alt={token.symbol}
                width={18}
                height={18}
                unloader={<CoinIcon width={24} height={24} />}
              />
              <VStack gap={2}>
                <p className={styles.symbol}>{token.symbol}</p>
                <HStack alignItems="center" gap={2}>
                  <Img
                    src={`/chain/${token.tokenOrigin?.id.toString()}.svg`}
                    alt={token.symbol}
                    width={11}
                    height={11}
                  />
                  <small
                    style={{
                      fontSize: 10,
                    }}
                  >
                    {token.tokenOrigin?.name}
                  </small>
                </HStack>
              </VStack>
              <ChevronDownIcon width={18} height={18} stroke="currentColor" />
            </button>
            <p
              className={styles.balance}
              onClick={() => setAmount(token.balance)}
            >
              Balance:{" "}
              <span className={styles.amount}>
                {token.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          </Fragment>
        )}
      </HStack>
      <VStack fullWidth gap={8}>
        {!token ? (
          <Fragment>
            <Skeleton width={200} height={25} />
            <Skeleton width={40} height={18} />
          </Fragment>
        ) : (
          <Fragment>
            <input
              type="number"
              placeholder="0.00"
              max={token.balance}
              value={value}
              className={styles.input}
              disabled={!!from}
              onChange={(e) => handleAmount(Number(e.target.value))}
            />
            <small className={styles.output}>
              ≈ $
              {output.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </small>
          </Fragment>
        )}
      </VStack>
    </div>
  )
}

export default Asset
