import classNames from "classnames/bind"
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react"
import styles from "./Button.module.scss"

const cx = classNames.bind(styles)

const Button = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button className={cx(className, "button")} {...props}>
      {children}
    </button>
  )
}

export default Button
