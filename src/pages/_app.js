import "@/styles/globals.css";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ComboFind - Helper</title> 
        <link rel="icon" href="https://www.favicon.cc/logo3d/366820.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}