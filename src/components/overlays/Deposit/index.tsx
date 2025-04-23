import {
  ClosableComponentProps,
  CopyText,
  CrossIcon,
  HStack,
  Match,
  Modal,
  VStack,
} from "@big-components/ui"
import styles from "./Deposit.module.scss"
import QRCode from "react-qr-code"
import { Fragment, useState } from "react"
import { useUser } from "providers/UserProvider"

type DepositOverlayProps = ClosableComponentProps

const DepositOverlay = ({ onClose }: DepositOverlayProps) => {
  const { user } = useUser()
  const [view, setView] = useState<"qr" | "card">("qr")
  
  const userAddress = user?.address || ""

  return (
    <Modal className={styles.modal}>
      <HStack fullWidth justifyContent="space-between" alignItems="center">
        <h1 className={styles.title}>Deposit</h1>
        <button onClick={onClose} className={styles.close}>
          <CrossIcon width={18} height={18} fill="currentColor" />
        </button>
      </HStack>
      <Match
        value={view}
        qr={() => (
          <Fragment>
            <VStack fullWidth gap={8} alignItems="center">
              <div className={styles.qr}>
                <QRCode
                  size={225}
                  style={{ width: "100%", height: "auto" }}
                  value={userAddress}
                  viewBox="0 0 225 225"
                />
              </div>
              <CopyText value={userAddress}>{userAddress}</CopyText>
              <p className={styles.description}>
                Scan the QR code or copy the address to deposit funds.
              </p>
            </VStack>
            <VStack fullWidth alignItems="flex-end">
              <p className={styles.card} onClick={() => setView("card")}>
                or pay with card {">"}
              </p>
            </VStack>
          </Fragment>
        )}
        card={() => (
          <VStack whole gap={24}>
            <VStack fullWidth gap={4}>
              <label className={styles.label}>Card number</label>
              <input
                type="text"
                placeholder="**** **** **** ****"
                className={styles.input}
              />
            </VStack>
            <VStack fullWidth gap={4}>
              <label className={styles.label}>Cardholder name</label>
              <input
                type="text"
                placeholder="J. Smith"
                className={styles.input}
              />
            </VStack>
            <HStack fullWidth gap={12}>
              <VStack fullWidth gap={4}>
                <label className={styles.label}>Expiration date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className={styles.input}
                />
              </VStack>
              <VStack fullWidth gap={4}>
                <label className={styles.label}>CVC</label>
                <input type="text" placeholder="***" className={styles.input} />
              </VStack>
            </HStack>
            <button className={styles.button}>Pay</button>
          </VStack>
        )}
      />
      <button className={styles.button} onClick={onClose}>
        Close
      </button>
    </Modal>
  )
}

export default DepositOverlay
