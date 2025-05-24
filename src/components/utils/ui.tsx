import { PixelDinoIcon } from "assets"
import styles from "./ui.module.scss"
import { SVGProps } from "react"
import { HStack, VStack } from "@big-components/ui"

const Spinner = () => {
  return <div className={styles.loader} />
}

const LoadingText = () => {
  return <div className={styles.loading__text} />
}

const DinoLoader = ({
  text,
  ...props
}: SVGProps<SVGSVGElement> & { text?: boolean }) => {
  return (
    <VStack alignItems="center" gap={4}>
      <PixelDinoIcon className={styles.dino__loader} {...props} />
      {text && (
        <HStack alignItems="flex-end">
          <p
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "var(--unifi-primary)",
            }}
          >
            Loading
          </p>
          <div className={styles.dots} />
        </HStack>
      )}
    </VStack>
  )
}

export { Spinner, LoadingText, DinoLoader }
