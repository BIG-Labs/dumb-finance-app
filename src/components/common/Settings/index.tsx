import { MenuIcon, UserIcon } from "assets"
import { useEffect, useRef, useState } from "react"
import styles from "./Settings.module.scss"
import { HStack, VStack } from "@big-components/ui"
import { useUser } from "providers/UserProvider"

const Settings = () => {
  const { user, connected, disconnect } = useUser()

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
      <button
        className={styles.menu}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={!connected}
      >
        <MenuIcon width={18} height={18} stroke="currentColor" />
        <UserIcon width={18} height={18} stroke="currentColor" />
      </button>
      {isOpen && (
        <div className={styles.list}>
          <VStack whole center gap={16}>
            <HStack fullWidth gap={8} alignItems="center">
              <UserIcon
                width={45}
                height={45}
                stroke="currentColor"
                style={{
                  borderRadius: "9999px",
                  border: "3px solid var(--unifi-text)",
                }}
              />
              <VStack gap={4}>
                <h1>{user?.username}</h1>
                <small>0x1234...1234</small>
              </VStack>
            </HStack>
            <button
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
            </button>
          </VStack>
        </div>
      )}
    </div>
  )
}

export default Settings
