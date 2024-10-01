import "@/styles/globals.css";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ComboFind - Helper</title> 
        <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/4205/4205819.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}