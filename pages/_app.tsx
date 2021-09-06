import "tailwindcss/tailwind.css";
import Head from "next/head";
import type { AppProps } from "next/app";

import "../styles/markdown.css";

import Layout from "../components/Layout";
import { myData } from "../data/myData";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <meta charSet="utf-8" />
        <title>{myData.sitename}</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
