import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';

import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
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
