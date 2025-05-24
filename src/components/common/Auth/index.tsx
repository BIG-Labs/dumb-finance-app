import { Center, Match } from "@big-components/ui"
import { useState } from "react"
import Login from "./Login"
import Register from "./Register"
import styles from "./Auth.module.scss"
import useLogin from "post/useLogin"
import useRegister from "post/useRegister"
import WalkingDino from "../WalkingDino"

const Auth = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [view, setView] = useState<"login" | "register">("login")

  const { mutate: login } = useLogin()
  const { mutate: register } = useRegister({
    onSuccess: () => setView("login"),
  })

  return (
    <Center>
      <div className={styles.container}>
        <WalkingDino />
        <Match
          value={view}
          login={() => (
            <Login
              setView={() => {
                setUsername("")
                setEmail("")
                setView("register")
              }}
              onLogin={() =>
                login({
                  email,
                })
              }
              setEmail={setEmail}
            />
          )}
          register={() => (
            <Register
              setView={() => {
                setUsername("")
                setEmail("")
                setView("login")
              }}
              onRegister={() =>
                register({
                  username,
                  email,
                })
              }
              setEmail={setEmail}
              setUsername={setUsername}
            />
          )}
        />
      </div>
    </Center>
  )
}

export default Auth
