import { PixelDinoIcon } from "assets"
import classNames from "classnames/bind"
import { useRef, useState } from "react"
import styles from "./WalkingDino.module.scss"

const cx = classNames.bind(styles)

const WalkingDino = () => {
  const dinoRef = useRef<SVGSVGElement>(null)
  const [isJumping, setIsJumping] = useState(false)

  const handleJump = () => {
    if (isJumping) return

    const dino = dinoRef.current
    if (!dino) return

    const style = getComputedStyle(dino)
    const matrix = new DOMMatrixReadOnly(style.transform)
    const scaleX = matrix.a
    const tx = matrix.e

    dino.style.setProperty("--scale-x", scaleX.toString())
    dino.style.setProperty("--tx", `${tx}px`)

    setIsJumping(true)
    dino.addEventListener("animationend", () => setIsJumping(false), {
      once: true,
    })
  }

  return (
    <PixelDinoIcon
      width={38}
      height={38}
      className={cx("dino", { jump: isJumping })}
      ref={dinoRef}
      onClick={handleJump}
      fill="var(--unifi-primary)"
    />
  )
}

export default WalkingDino
