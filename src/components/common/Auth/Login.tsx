import { HStack, VStack } from "@big-components/ui"
import styles from "./Auth.module.scss"

interface LoginProps {
  setView: () => void
  onLogin: () => void
  setEmail: (email: string) => void
}

const Login = ({ setView, onLogin, setEmail }: LoginProps) => {
  return (
    <VStack fullWidth gap={32} className={styles.login}>
      <HStack fullWidth alignItems="center" justifyContent="space-between">
        <h1>Log In</h1>
        <h4 onClick={setView}>Sign In</h4>
      </HStack>
      <VStack fullWidth gap={8}>
        <label>Email</label>
        <input
          type="text"
          placeholder="hello@greeting.com"
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
      </VStack>
      <button className={styles.button} onClick={onLogin}>
        Log In
      </button>
    </VStack>
  )
}

export default Login
