import "../styles/globals.css";
import "../styles.css";
import 'nextra-theme-docs/style.css'
import "@algolia/autocomplete-theme-classic";


const App = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return <>
    {getLayout(<Component {...pageProps} />)}
    <a href="https://discord.gg/CRuWmSQZQx" className="fixed bottom-0 right-0 px-4 py-2 text-lg bg-white text-black hover:to-blue-400 transition hover:text-blue-500 rounded-none cursor-pointer">Need help? Join discord</a>
  </>
}

export default App
