import { ChevronDownIcon, HStack, Match, VStack } from "@big-components/ui"
import { CoinIcon, SuccessIcon } from "assets"
import ProfitText from "components/common/Profit/ProfitText"
import { LoadingText, Spinner } from "components/utils/ui"
import useSwap from "post/useSwap"
import useTokensQuery from "queries/useTokensQuery"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Img } from "react-image"
import { Token } from "types/response"
import Actions from "../Actions"
import styles from "./Swap.module.scss"
import { parseUnits, toHex } from "viem"

interface SwapProps {
  token: Token & { balance: number }
}

const Swap = ({ token }: SwapProps) => {
  const { data } = useTokensQuery()

  const tokens = useMemo(() => {
    if (!data) return []

    return data
  }, [data])

  const { mutate, reset, status } = useSwap()

  const [amount, setAmount] = useState<number>()

  const [open, setOpen] = useState(false)
  const [to, setTo] = useState<Token>()

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

  const outputTo = useMemo(() => {
    if (!to || !amount) return 0

    return output / to.price
  }, [amount, output, to])

  useEffect(() => {
    setTo(tokens.filter((t) => t.symbol !== token.symbol)[0])
  }, [token.symbol, tokens])

  return (
    <div className={styles.container}>
      {open ? (
        <VStack whole>
          {tokens
            .filter((t) => t.symbol !== token.symbol)
            .map((token) => {
              const {
                address,
                balance,
                name,
                symbol,
                price,
                icon,
                percentChange,
              } = token

              return (
                <div
                  key={address}
                  className={styles.token}
                  onClick={() => {
                    setTo(token)
                    setOpen(false)
                  }}
                >
                  <HStack alignItems="center" gap={8}>
                    <Img
                      src={icon}
                      alt={name}
                      width={22}
                      height={22}
                      unloader={<CoinIcon width={24} height={24} />}
                    />
                    <VStack alignItems="flex-start" gap={2}>
                      <HStack alignItems="center" gap={4}>
                        <p className={styles.name}>{name}</p>
                        <ProfitText percentage={percentChange} size={11} />
                      </HStack>
                      <HStack alignItems="center" gap={6}>
                        <p className={styles.symbol}>{symbol}</p>
                        <div className={styles.line} />
                        <p className={styles.price}>
                          ${price.toLocaleString()}
                        </p>
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack alignItems="center" gap={8}>
                    <VStack alignItems="flex-end" gap={2}>
                      <p className={styles.balance}>
                        {balance.toLocaleString()}
                      </p>
                      <p className={styles.value}>
                        $
                        {(balance * price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </VStack>
                  </HStack>
                </div>
              )
            })}
          <button
            className={styles.button}
            onClick={() => {
              setOpen(false)
            }}
          >
            Close
          </button>
        </VStack>
      ) : (
        <Match
          value={status}
          idle={() => (
            <VStack whole gap={28}>
              <Actions />
              <div className={styles.asset}>
                <HStack
                  fullWidth
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <button className={styles.item}>
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
                    onClick={() => handleAmount(token.balance)}
                  >
                    Balance:{" "}
                    <span className={styles.amount}>
                      {token.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </HStack>
                <VStack fullWidth gap={8}>
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
                </VStack>
              </div>
              <div className={styles.separator} />
              <div className={styles.asset}>
                <HStack
                  fullWidth
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <button className={styles.item} onClick={() => setOpen(true)}>
                    <Img
                      src={to?.icon || ""}
                      alt={to?.symbol}
                      width={18}
                      height={18}
                      unloader={<CoinIcon width={24} height={24} />}
                    />
                    <p className={styles.symbol}>{to?.symbol}</p>
                    <ChevronDownIcon
                      width={18}
                      height={18}
                      stroke="currentColor"
                    />
                  </button>
                  <p className={styles.balance}>
                    Balance:{" "}
                    <span className={styles.amount}>
                      {token.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </HStack>
                <VStack fullWidth gap={8}>
                  <input
                    type="number"
                    placeholder="0.00"
                    max={token.balance}
                    value={outputTo}
                    className={styles.input}
                    disabled
                  />
                  <small className={styles.output}>
                    ≈ $
                    {output.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </small>
                </VStack>
              </div>
              <button
                className={styles.button}
                onClick={() =>
                  mutate({
                    tokenIn: {
                      address: toHex(token.address),
                      amount: parseUnits(
                        amount?.toString() ?? "0",
                        token.decimals
                      ),
                      chainId: token.chainId,
                    },
                    tokenOut: {
                      address: toHex(to?.address || ""),
                      amount: parseUnits(
                        outputTo?.toString() ?? "0",
                        token.decimals
                      ),
                      chainId: to?.chainId ?? 0,
                    },
                  })
                }
              >
                Trade
              </button>
            </VStack>
          )}
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
                  You have successfully swapped <strong>{token?.symbol}</strong>{" "}
                  to <strong>{to?.symbol}</strong>!
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
                Please wait while we swap <strong>{token.symbol}</strong> to{" "}
                <strong>{to?.symbol}</strong>!
              </h3>
            </VStack>
          )}
        />
      )}
    </div>
  )
}

export default Swap
