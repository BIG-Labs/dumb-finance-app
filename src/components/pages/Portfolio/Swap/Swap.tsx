import useTokensQuery from "queries/useTokensQuery"
import Actions from "./Actions/Actions"
import styles from "./Swap.module.scss"
import { useEffect, useMemo, useState } from "react"
import { HStack, VStack } from "@big-components/ui"
import { SwapIcon } from "assets"
import { Token } from "types/response"
import Asset from "./Asset/Asset"

const Swap = () => {
  const { data } = useTokensQuery()

  const tokens = useMemo(() => {
    if (!data) return []

    return data
  }, [data])

  const [amount, setAmount] = useState<number>(0)

  const [from, setFrom] = useState<Token>()
  const [to, setTo] = useState<Token>()

  useEffect(() => {
    setFrom(tokens[0])
    setTo(tokens[1])
  }, [tokens])

  return (
    <div className={styles.container}>
      <Actions />
      <VStack fullWidth>
        <Asset
          token={from}
          onOpen={() => {}}
          amount={amount}
          setAmount={setAmount}
        />
        <HStack fullWidth alignItems="center" gap={12}>
          <div className={styles.separator} />
          <button
            className={styles.swap}
            onClick={() => {
              setFrom(to)
              setTo(from)
              setAmount(0)
            }}
          >
            <SwapIcon width={20} height={20} stroke="currentColor" />
          </button>
          <div className={styles.separator} />
        </HStack>
        <Asset
          token={to}
          from={from}
          onOpen={() => {}}
          amount={amount}
          setAmount={setAmount}
        />
      </VStack>
      <button className={styles.button}>Swap</button>
    </div>
  )
}

export default Swap
