import { VStack } from "@big-components/ui"
import styles from "./Auth.module.scss"
import Button from "../Button"

interface RegisterProps {
  setView: () => void
  onRegister: () => void
  setUsername: (username: string) => void
  setEmail: (email: string) => void
}

const Register = ({
  setView,
  onRegister,
  setEmail,
  setUsername,
}: RegisterProps) => {
  return (
    <VStack fullWidth gap={32} className={styles.login}>
      <h1>Sign In</h1>
      <VStack fullWidth gap={8}>
        <label>Email</label>
        <input
          type="text"
          placeholder="hello@greeting.com"
          className={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
      </VStack>
      <VStack fullWidth gap={8}>
        <label>Username</label>
        <input
          type="text"
          placeholder="RedCake123"
          className={styles.input}
          onChange={(e) => setUsername(e.target.value)}
        />
      </VStack>
      <Button animation onClick={onRegister}>
        Sign In
      </Button>
      <h4 onClick={setView}>
        Already have an account? <span>Log In</span>
      </h4>
    </VStack>
  )
}

export default Register
