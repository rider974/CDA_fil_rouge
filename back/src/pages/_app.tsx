import "@/styles/globals.css";
import { Helmet } from "react-helmet";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Helmet>
        <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
        />
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="X-Frame-Options" content="DENY" />
          <meta name="X-XSS-Protection" content="1; mode=block" />
          <meta name="Referrer-Policy" content="no-referrer" />
          <title>BeginnersAppDev</title>
        </Head>
      </Helmet>

 

      <Component {...pageProps} />;
    </>
  );
}
