import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "instantsearch.css/themes/satellite-min.css"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
