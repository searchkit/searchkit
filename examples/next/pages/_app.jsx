import '@elastic/eui/dist/eui_theme_light.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default ({ Component, pageProps }) => {

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (gtag && gtag.pageview) gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
