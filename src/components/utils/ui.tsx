import styles from "./ui.module.scss"

export const Spinner = () => {
  return <div className={styles.loader} />
}

export const LoadingText = () => {
  return <div className={styles.loading__text} />
}
