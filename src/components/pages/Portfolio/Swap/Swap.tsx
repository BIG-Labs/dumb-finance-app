import useTokensQuery from "queries/useTokensQuery"
import Actions from "./Actions/Actions"
import styles from "./Swap.module.scss"
import { useCallback, useEffect, useMemo, useState } from "react"
import { HStack, Match, VStack } from "@big-components/ui"
import { CoinIcon, SuccessIcon, SwapIcon } from "assets"
import { Token } from "types/response"
import Asset from "./Asset/Asset"
import useSwap from "post/useSwap"
import { LoadingText, Spinner } from "components/utils/ui"
import { Img } from "react-image"
import ProfitText from "components/common/Profit/ProfitText"
import { Hex } from "viem"
import { toChainAmount } from "@big-components/utils"

const Swap = () => {
  const { data } = useTokensQuery()

  const tokens = useMemo(() => {
    if (!data) return []

    return data
  }, [data])

  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)

  const [amount, setAmount] = useState<number>()

  const [from, setFrom] = useState<Token>()
  const [to, setTo] = useState<Token>()

  useEffect(() => {
    setFrom(tokens[0])
    setTo(tokens[1])
  }, [tokens])

  const handleSwap = useCallback(() => {
    setFrom(to)
    setTo(from)
    setAmount(0)
  }, [from, to])

  const handleToken = useCallback(
    (token: Token) => {
      if (openFrom) {
        if (token === to) {
          handleSwap()
          setOpenFrom(false)
        } else {
          setFrom(token)
          setOpenFrom(false)
        }
      } else {
        if (token === from) {
          handleSwap()
          setOpenTo(false)
        } else {
          setTo(token)
          setOpenTo(false)
        }
      }
    },
    [openFrom, from, handleSwap, to]
  )

  const { mutate, status, reset } = useSwap()

  return (
    <div className={styles.container}>
      {openFrom || openTo ? (
        <VStack whole className={styles.tokens}>
          {tokens.map((token) => {
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
                onClick={() => handleToken(token)}
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
                      <p className={styles.price}>${price.toLocaleString()}</p>
                    </HStack>
                  </VStack>
                </HStack>
                <HStack alignItems="center" gap={8}>
                  <VStack alignItems="flex-end" gap={2}>
                    <p className={styles.balance}>{balance.toLocaleString()}</p>
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
              setOpenFrom(false)
              setOpenTo(false)
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
              <VStack fullWidth>
                <Asset
                  token={from}
                  onOpen={() => setOpenFrom(true)}
                  amount={amount}
                  setAmount={setAmount}
                />
                <HStack fullWidth alignItems="center" gap={12}>
                  <div className={styles.separator} />
                  <button
                    className={styles.swap}
                    onClick={handleSwap}
                    disabled={status === "pending"}
                  >
                    <SwapIcon width={20} height={20} stroke="currentColor" />
                  </button>
                  <div className={styles.separator} />
                </HStack>
                <Asset
                  token={to}
                  from={from}
                  onOpen={() => setOpenTo(true)}
                  amount={amount}
                  setAmount={setAmount}
                />
              </VStack>
              <button
                className={styles.button}
                style={{ marginTop: "auto" }}
                onClick={() => {
                  mutate({
                    tokenIn: {
                      address: (from?.address || "") as Hex,
                      amount: toChainAmount(amount || 0, from?.decimals || 0),
                    },
                    tokenOut: {
                      address: (to?.address || "") as Hex,
                      amount: 0,
                    },
                  })
                }}
              >
                Swap
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
                  You have successfully swapped <strong>{from?.symbol}</strong>{" "}
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
                Please wait while we swap <strong>{from?.symbol}</strong> to{" "}
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
