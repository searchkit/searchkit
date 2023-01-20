import "../styles/globals.css";
import "../styles.css";
import 'nextra-theme-docs/style.css'
import "@algolia/autocomplete-theme-classic";


const App = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default App
