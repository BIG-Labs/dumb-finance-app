import { ArrowDownIcon, ArrowUpIcon } from "assets"
import classNames from "classnames/bind"
import { useMemo } from "react"
import styles from "./Profit.module.scss"

interface ProfitTextProps {
  percentage: number
}

const cx = classNames.bind(styles)

const ProfitButton = ({ percentage }: ProfitTextProps) => {
  const isPositive = useMemo(() => percentage > 0, [percentage])

  return (
    <button
      className={cx("button", {
        positive: isPositive,
        negative: !isPositive,
      })}
    >
      {isPositive ? (
        <ArrowUpIcon width={12} height={12} fill="currentColor" />
      ) : (
        <ArrowDownIcon width={12} height={12} fill="currentColor" />
      )}
      <span className={cx({ positive: isPositive, negative: !isPositive })}>
        {Math.abs(percentage)}%
      </span>
    </button>
  )
}

export default ProfitButton
