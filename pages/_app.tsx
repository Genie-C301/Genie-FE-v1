import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { useState } from 'react';
import Head from 'next/head';
import { Layout } from 'components/Layout';
import { AppContext } from '@/components/Aptos/AppContext';

export default function App({ Component, pageProps }: AppProps) {
  const [isLightTheme, setIsLightTheme] = useState(true);
  const changeTheme = () => {
    console.log('changeTheme');
    console.log(isLightTheme);
    setIsLightTheme(!isLightTheme);
  };

  return (
    <>
      <AppContext>
        <Layout changeTheme={changeTheme}>
          <Head>
            <title>Genie</title>
            <meta name="description" content="Genie: aptos magic" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Component {...pageProps} />
        </Layout>
        <div id="modal-root"></div>
      </AppContext>
    </>
  );
}
