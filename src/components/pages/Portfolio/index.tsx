import { HStack, VStack } from "@big-components/ui"
import Chart from "./Chart"
import Swap from "./Swap"
import Tokens from "./Tokens"

const Portfolio = () => {
  return (
    <HStack whole padding={24} gap={42}>
      <VStack whole gap={24}>
        <VStack fullWidth>
          <Chart />
        </VStack>
        <Tokens />
      </VStack>
      <Swap />
    </HStack>
  )
}

export default Portfolio
