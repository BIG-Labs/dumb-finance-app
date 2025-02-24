import { SearchIcon } from "@big-components/ui"
import styles from "./Header.module.scss"
import { links } from "constants/links"
import { capitalizeFirstLetter } from "@big-components/utils"
import { LogoIcon } from "assets"

const Header = () => {
  return (
    <header className={styles.header}>
      <LogoIcon width={50} height={50} />
      <div className={styles.search}>
        <SearchIcon width={18} height={18} stroke="var(--unifi-text)" />
        <input placeholder="Coming soon..." />
      </div>
      <div className={styles.links}>
        {links.map((link) => (
          <div key={link} className={styles.wrapper}>
            <p className={styles.link}>{capitalizeFirstLetter(link)}</p>
          </div>
        ))}
      </div>
    </header>
  )
}

export default Header
