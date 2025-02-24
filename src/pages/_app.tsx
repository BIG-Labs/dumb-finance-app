import "@big-components/ui/dist/style.css"
import Header from "components/common/Header/Header"
import type { AppProps } from "next/app"
import Head from "next/head"
import Providers from "providers/Providers"
import { Fragment } from "react"
import "styles/globals.scss"
import "styles/index.scss"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Dumb Finance</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main
        style={{
          padding: "0 32px",
        }}
      >
        <Providers>
          <Header />
          <Component {...pageProps} />
        </Providers>
      </main>
    </Fragment>
  )
}
