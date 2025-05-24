import { MenuIcon, UserIcon } from "assets"
import { useEffect, useRef, useState } from "react"
import styles from "./Settings.module.scss"
import { CopyText, HStack, VStack } from "@big-components/ui"
import { useUser } from "providers/UserProvider"
import { truncate } from "@big-components/utils"
import Button from "../Button"
import classNames from "classnames/bind"

const cx = classNames.bind(styles)

const Settings = () => {
  const { connected, user, disconnect } = useUser()

  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsOpen(false)
    }

    document.onkeydown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={ref} className={styles.settings}>
      <Button
        className={cx("menu", {
          open: isOpen,
        })}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={!connected}
      >
        <MenuIcon width={18} height={18} stroke="currentColor" />
        <UserIcon width={18} height={18} stroke="currentColor" />
      </Button>
      {isOpen && (
        <div className={styles.list}>
          <VStack whole center gap={12}>
            <HStack fullWidth gap={8} alignItems="center">
              <UserIcon
                width={40}
                height={40}
                stroke="var(--unifi-primary)"
                style={{
                  borderRadius: "9999px",
                  border: "3px solid var(--unifi-primary)",
                }}
              />
              <h1>{user?.username}</h1>
            </HStack>
            <CopyText value={user?.address || ""} size={12}>
              {truncate(user?.address || "", 8, 8)}
            </CopyText>
            <Button
              className={styles.menu}
              style={{
                width: "100%",
              }}
              onClick={() => {
                setIsOpen(false)
                disconnect()
              }}
            >
              Disconnect
            </Button>
          </VStack>
        </div>
      )}
    </div>
  )
}

export default Settings
