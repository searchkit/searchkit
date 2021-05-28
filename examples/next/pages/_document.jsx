import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <title>Searchkit Demo</title>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-Y1LWVCFZQK`}
          />
          <script src={"https://maps.googleapis.com/maps/api/js?key=AIzaSyCnxbEhpVqsd7m-dDGb3mJrFEnZFSKdKOU&libraries=places"} defer></script>
          <script
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
