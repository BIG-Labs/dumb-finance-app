interface TokenProps {
  id: number
}

const Token = ({}: TokenProps) => {
  return null

  /* return isLoading || !data ? (
    <Center
      style={{
        minHeight: "70vh",
      }}
    >
      <DinoLoader width={65} height={65} fill="var(--unifi-primary)" text />
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
              {0} {data.symbol}
            </h1>
            <p className={styles.symbol}>
              ${(0 * data.price).toLocaleString()}
            </p>
          </VStack>
        </HStack>
        <VStack fullWidth>
          <DynamicChart token={data} />
        </VStack>
      </VStack>
      <Swap token={data} />
    </HStack>
  ) */
}

export default Token
