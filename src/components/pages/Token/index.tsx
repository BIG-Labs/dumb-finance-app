import { Center, HStack, VStack } from "@big-components/ui"
import { Spinner } from "components/utils/ui"
import useTokenQuery from "queries/useTokenQuery"
import dynamic from "next/dynamic"
import { Img } from "react-image"
import { CoinIcon } from "assets"
import styles from "./Token.module.scss"
import Swap from "./Swap"

const DynamicChart = dynamic(() => import("./Chart"), { ssr: false })

interface TokenProps {
  id: number
}

const Token = ({ id }: TokenProps) => {
  const { data, isLoading } = useTokenQuery(id)

  return isLoading || !data ? (
    <Center
      style={{
        minHeight: "70vh",
      }}
    >
      <Spinner />
    </Center>
  ) : (
    <HStack whole padding={24} gap={42}>
      <VStack whole gap={24}>
        <HStack
          fullWidth
          gap={12}
          alignItems="center"
          justifyContent="space-between"
          className={styles.token}
        >
          <HStack gap={12} alignItems="center">
            <Img
              src={data.icon}
              alt={data.name}
              width={52}
              height={52}
              unloader={<CoinIcon width={52} height={52} />}
            />
            <VStack gap={4} justifyContent="space-between">
              <h1 className={styles.name}>{data.name}</h1>
              <p className={styles.symbol}>{data.symbol}</p>
            </VStack>
          </HStack>
          <VStack alignItems="flex-end" gap={4}>
            <h1 className={styles.name}>
              {data.balance} {data.symbol}
            </h1>
            <p className={styles.symbol}>
              ${(data.balance * data.price).toLocaleString()}
            </p>
          </VStack>
        </HStack>
        <VStack fullWidth>
          <DynamicChart token={data} />
        </VStack>
      </VStack>
      <Swap token={data}/>
    </HStack>
  )
}

export default Token
