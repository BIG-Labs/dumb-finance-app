import classNames from "classnames/bind"
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react"
import styles from "./Button.module.scss"

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  animation?: boolean
}

const cx = classNames.bind(styles)

const Button = ({ children, className, animation = true, ...props }: ButtonProps) => {
  return (
    <button
      className={cx(className, "button", {
        animation,
      })}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
