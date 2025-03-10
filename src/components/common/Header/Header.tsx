import { HStack, Opener, SearchIcon } from "@big-components/ui"
import styles from "./Header.module.scss"
import { links } from "constants/links"
import { capitalizeFirstLetter } from "@big-components/utils"
import { LogoIcon } from "assets"
import Link from "next/link"
import classNames from "classnames/bind"
import DepositOverlay from "components/overlays/Deposit"
import Settings from "../Settings"

const cx = classNames.bind(styles)

const Header = () => {
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
              <Link href={`/${link === "home" ? "" : link}`} passHref>
                <p className={styles.link}>{capitalizeFirstLetter(link)}</p>
              </Link>
            </div>
          ))}
        </div>
      </HStack>
      <HStack alignItems="center" gap={32}>
        <Opener
          renderOpener={({ onOpen }) => (
            <button className={cx(styles.menu, "deposit")} onClick={onOpen}>
              Deposit
            </button>
          )}
          renderContent={({ onClose }) => <DepositOverlay onClose={onClose} />}
        />
        <Settings />
      </HStack>
    </header>
  )
}

export default Header
