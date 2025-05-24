import useTokensQuery from "queries/useTokensQuery"
import Actions from "./Actions"
import styles from "./Swap.module.scss"
import { useEffect, useMemo, useState } from "react"
import { HStack, Match, VStack } from "@big-components/ui"
import { CoinIcon, SuccessIcon, SwapIcon } from "assets"
import { Token } from "types/response"
import Asset from "./Asset"
import useSwap from "post/useSwap"
import { DinoLoader, LoadingText } from "components/utils/ui"
import { Img } from "react-image"
import ProfitText from "components/common/Profit/ProfitText"
import Button from "components/common/Button"
import { assertValue } from "components/utils"
import { Hex, parseUnits } from "viem"

const Swap = () => {
  const { data } = useTokensQuery()

  const tokens = useMemo(() => {
    if (!data) return []

    return data
  }, [data])

  const [openFrom, setOpenFrom] = useState(false)
  const [openTo, setOpenTo] = useState(false)

  const [amount, setAmount] = useState<number>()

  const [from, setFrom] = useState<Token & { balance: number }>(
    tokens[tokens.findIndex((token) => token.symbol === "WAVAX")]
  )
  const [to, setTo] = useState<Token & { balance: number }>(
    tokens[tokens.findIndex((token) => token.symbol === "USDC")]
  )

  useEffect(() => {
    setFrom(tokens[tokens.findIndex((token) => token.symbol === "WAVAX")])
    setTo(tokens[tokens.findIndex((token) => token.symbol === "USDC")])
  }, [tokens])

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
              <div key={address} className={styles.token}>
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
              <Button
                style={{ marginTop: "auto" }}
                animation
                onClick={() => {
                  mutate({
                    tokenIn: {
                      address: assertValue(from.address, "0x") as Hex,
                      amount: parseUnits(
                        amount?.toString() ?? "0",
                        from.decimals
                      ),
                      chainId: from.chainId,
                    },
                    tokenOut: {
                      address: assertValue(to.address, "0x") as Hex,
                      amount: BigInt(0),
                      chainId: to.chainId,
                    },
                  })
                }}
              >
                Swap
              </Button>
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
              <DinoLoader
                width={100}
                height={100}
                fill="var(--unifi-primary)"
              />
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
