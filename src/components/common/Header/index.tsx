import { HStack, Opener, SearchIcon } from "@big-components/ui"
import styles from "./Header.module.scss"
import { links } from "constants/links"
import { capitalizeFirstLetter } from "@big-components/utils"
import { LogoIcon } from "assets"
import Link from "next/link"
import classNames from "classnames/bind"
import DepositOverlay from "components/overlays/Deposit"
import Settings from "../Settings"
import { useRouter } from "next/router"
import { useCallback } from "react"
import Button from "../Button"
import { useUser } from "providers/UserProvider"

const cx = classNames.bind(styles)

const Header = () => {
  const { pathname } = useRouter()
  const { connected } = useUser()

  const isActive = useCallback(
    (link: string) => {
      if (link === "home" && pathname === "/") return true

      return pathname === link
    },
    [pathname]
  )

  return (
    <header className={styles.header}>
      <HStack alignItems="center" gap={42}>
        <LogoIcon width={50} height={50} />
        <div className={styles.search}>
          <SearchIcon width={18} height={18} stroke="var(--unifi-text)" />
          <input placeholder="Coming soon..." />
        </div>
        <div className={styles.links}>
          {links.map((link) => (
            <div key={link} className={styles.wrapper}>
              <Link href="/" passHref>
                <p
                  className={cx("link", {
                    active: isActive(link),
                  })}
                >
                  {capitalizeFirstLetter(link)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </HStack>
      <HStack alignItems="center" gap={28}>
        <Opener
          renderOpener={({ onOpen }) => (
            <Button
              className={cx("deposit")}
              onClick={onOpen}
              disabled={!connected}
            >
              Deposit
            </Button>
          )}
          renderContent={({ onClose }) => <DepositOverlay onClose={onClose} />}
        />
        <Settings />
      </HStack>
    </header>
  )
}

export default Header
