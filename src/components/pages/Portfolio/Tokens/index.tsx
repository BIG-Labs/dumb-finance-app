import { HStack, SearchIcon, VStack } from "@big-components/ui"
import styles from "./Tokens.module.scss"
import useTokensQuery from "queries/useTokensQuery"
import { useMemo } from "react"
import { Img } from "react-image"
import { ChevronRightIcon, CoinIcon } from "assets"
import ProfitText from "components/common/Profit/ProfitText"
import { useRouter } from "next/router"
import Skeleton from "react-loading-skeleton"
import { assertNumberTooSmall } from "components/utils/math"

const Tokens = () => {
  const { push } = useRouter()

  const { data, isLoading } = useTokensQuery()

  const tokens = useMemo(() => {
    if (isLoading || !data) {
      return []
    }

    return data
  }, [data, isLoading])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <HStack alignItems="center" gap={12} whole>
          <SearchIcon width={16} height={16} stroke="var(--unifi-text)" />
          <input className={styles.input} placeholder="Search assets" />
        </HStack>
      </div>
      <div className={styles.tokens}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles.row}>
                <Skeleton height={52} width={100} />
              </div>
            ))
          : tokens.map(
              ({
                id,
                address,
                icon,
                name,
                symbol,
                price,
                balance,
                percentChange,
              }) => (
                <div
                  key={`${address}-${id}`}
                  className={styles.row}
                  onClick={() =>
                    push(`/token/${id}`, undefined, { shallow: true })
                  }
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
                        {assertNumberTooSmall(balance, 0.01)}
                      </p>
                      <p className={styles.value}>
                        {assertNumberTooSmall(balance * price, 0.01, 2, true)}
                      </p>
                    </VStack>
                    <ChevronRightIcon
                      width={20}
                      height={20}
                      stroke="var(--unifi-primary)"
                      strokeWidth={1.5}
                    />
                  </HStack>
                </div>
              )
            )}
      </div>
    </div>
  )
}

export default Tokens
