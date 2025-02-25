import { capitalizeFirstLetter } from "@big-components/utils"
import classNames from "classnames/bind"
import { useState } from "react"
import styles from "./Actions.module.scss"

const buttons = ["trade", "lend", "borrow"]

const cx = classNames.bind(styles)

const Actions = () => {
  const [active, setActive] = useState("trade")

  return (
    <div className={styles.actions}>
      <div
        className={cx(styles.indicator, {
          first: active === "trade",
          last: active === "borrow",
        })}
      />
      {buttons.map((text) => (
        <button
          key={text}
          className={styles.action}
          onClick={() => setActive(text)}
        >
          {capitalizeFirstLetter(text)}
        </button>
      ))}
    </div>
  )
}

export default Actions
