import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';

import { Toaster } from 'react-hot-toast';

import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <Head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" type="image/png" href="/logo.png" />
                <link rel="apple-touch-icon" href="/logo.png" />
            </Head>
            <Component {...pageProps} />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: '#1E293B',
                        color: '#fff',
                        border: '1px solid #334155',
                    },
                }}
            />
        </ThemeProvider>
    );
}
