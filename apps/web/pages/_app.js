import "../styles/globals.css";
import "../styles.css";
import 'nextra-theme-docs/style.css'
import "@algolia/autocomplete-theme-classic";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";

const App = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", "G-Y1LWVCFZQK", {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <>
    {getLayout(<Component {...pageProps} />)}
    <a href="https://discord.gg/CRuWmSQZQx" className="fixed bottom-0 right-0 px-4 py-2 text-lg bg-white text-black hover:to-blue-400 transition hover:text-blue-500 rounded-none cursor-pointer">Need help? Join discord</a>
    <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-Y1LWVCFZQK`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y1LWVCFZQK', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
  </>
}

export default App
