import classNames from "classnames/bind"
import { Token } from "types/response"
import styles from "./Stats.module.scss"

interface StatsProps {
  token: Token
}

const cx = classNames.bind(styles)

const Stats = ({ token }: StatsProps) => {
  return (
    <div className={styles.stats}>
      <div className={styles.item}>
        <h1 className={styles.title}>Price</h1>
        <p className={styles.value}>${token.price.toLocaleString()}</p>
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>TVL</h1>
        <p className={styles.value}>${token.tvl.toLocaleString()}</p>
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>APR</h1>
        <p className={styles.value}>{token.apr}%</p>
      </div>
      <div className={styles.item}>
        <h1 className={styles.title}>Daily change</h1>
        <p
          className={cx("value", {
            positive: token.percentChange > 0,
            negative: token.percentChange < 0,
          })}
        >
          {token.percentChange}%
        </p>
      </div>
    </div>
  )
}

export default Stats
