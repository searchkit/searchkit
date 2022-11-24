import "../styles/globals.css";
import "../styles.css";
import 'nextra-theme-docs/style.css'

const App = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default App
