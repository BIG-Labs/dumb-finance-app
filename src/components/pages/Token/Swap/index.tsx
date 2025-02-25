import { Token } from "types/response"
import Actions from "../Actions"
import styles from "./Swap.module.scss"
import { Fragment, useCallback, useMemo, useState } from "react"
import { HStack, Match, VStack } from "@big-components/ui"
import { Img } from "react-image"
import { CoinIcon, SuccessIcon } from "assets"
import useSwap from "post/useSwap"
import { LoadingText, Spinner } from "components/utils/ui"

interface SwapProps {
  token: Token
}

const Swap = ({ token }: SwapProps) => {
  const { mutate, reset, status } = useSwap()

  const [amount, setAmount] = useState<number>()

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

  const output = useMemo(() => {
    if (!token || !amount) return 0

    return amount * token.price
  }, [amount, token])

  return (
    <div className={styles.container}>
      <Match
        idle={() => (
          <Fragment>
            <Actions />
            <div className={styles.asset}>
              <HStack
                fullWidth
                alignItems="center"
                justifyContent="space-between"
              >
                <button className={styles.token}>
                  <Img
                    src={token.icon}
                    alt={token.symbol}
                    width={18}
                    height={18}
                    unloader={<CoinIcon width={24} height={24} />}
                  />
                  <p className={styles.symbol}>{token.symbol}</p>
                </button>
                <p
                  className={styles.balance}
                  onClick={() => setAmount(token.balance)}
                >
                  Available to trade:{" "}
                  <span className={styles.amount}>
                    {token.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </HStack>
              <input
                type="number"
                placeholder="0.00"
                max={token.balance}
                value={amount}
                className={styles.input}
                onChange={(e) => handleAmount(Number(e.target.value))}
              />
              <small className={styles.output}>
                ≈ $
                {output.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </small>
            </div>
            <button className={styles.button} onClick={() => mutate()}>
              Trade
            </button>
          </Fragment>
        )}
        value={status}
        error={() => null}
        success={() => (
          <VStack whole center className={styles.transitions}>
            <VStack whole justifyContent="space-around">
              <h1 className={styles.title}>Swapped!</h1>
              <SuccessIcon
                width={100}
                height={100}
                fill="var(--unifi-positive)"
                className={styles.icon}
              />
              <h3 className={styles.message}>
                You have successfully traded <strong>{token.symbol}</strong>!
              </h3>
            </VStack>
            <button className={styles.button} onClick={reset}>
              Back
            </button>
          </VStack>
        )}
        pending={() => (
          <VStack
            whole
            center
            justifyContent="space-around"
            className={styles.transitions}
          >
            <LoadingText />
            <Spinner />
            <h3 className={styles.message}>
              Please wait while we trade <strong>{token.symbol}</strong>
            </h3>
          </VStack>
        )}
      />
    </div>
  )
}

export default Swap
