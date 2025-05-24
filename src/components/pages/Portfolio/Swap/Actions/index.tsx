import { capitalizeFirstLetter } from "@big-components/utils"
import { SwapIcon, PositiveIcon, NegativeIcon } from "assets"
import classNames from "classnames/bind"
import { useState } from "react"
import styles from "./Actions.module.scss"

const buttons = [
  {
    label: "swap",
    icon: <SwapIcon width={16} height={16} stroke="currentColor" />,
  },
  {
    label: "long",
    icon: <PositiveIcon width={16} height={16} stroke="currentColor" />,
  },
  {
    label: "short",
    icon: <NegativeIcon width={16} height={16} stroke="currentColor" />,
  },
]

const cx = classNames.bind(styles)

const Actions = () => {
  const [active, setActive] = useState("swap")

  return (
    <div className={styles.actions}>
      <div
        className={cx("indicator", {
          first: active === "swap",
          last: active === "short",
        })}
      />
      {buttons.map(({ icon, label }) => (
        <button
          key={label}
          className={cx("action", {
            active: active === label,
          })}
          onClick={() => setActive(label)}
        >
          {icon} {capitalizeFirstLetter(label)}
        </button>
      ))}
    </div>
  )
}

export default Actions
