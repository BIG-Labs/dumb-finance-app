import { HStack, VStack } from "@big-components/ui"
import styles from "./Auth.module.scss"
import Button from "../Button"

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onLogin()
            }
          }}
        />
      </VStack>
      <Button onClick={onLogin}>Log In</Button>
    </VStack>
  )
}

export default Login
