import { HStack } from "@big-components/ui"
import { NegativeIcon, PositiveIcon } from "assets"
import classNames from "classnames/bind"
import { useMemo } from "react"
import styles from "./Profit.module.scss"

interface ProfitTextProps {
  percentage: number
  size?: number
}

const cx = classNames.bind(styles)

const ProfitText = ({ percentage, size }: ProfitTextProps) => {
  const isPositive = useMemo(() => percentage > 0, [percentage])

  return (
    <HStack
      alignItems="center"
      gap={2}
      className={cx("text", {
        positive: isPositive,
        negative: !isPositive,
      })}
    >
      {isPositive ? (
        <PositiveIcon
          width={size || 14}
          height={size || 14}
          stroke="currentColor"
        />
      ) : (
        <NegativeIcon
          width={size || 14}
          height={size || 14}
          stroke="currentColor"
        />
      )}
      <p
        style={{
          fontSize: size || 14,
        }}
      >
        {percentage.toFixed(2)}%
      </p>
    </HStack>
  )
}

export default ProfitText
