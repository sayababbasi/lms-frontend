import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';

import { Toaster } from 'react-hot-toast';

import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <Head>
                <title>Revotic AI LMS | Next-Generation Learning Management System</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Discover Revotic AI LMS, the premier Learning Management System for universities and modern schools. Empowering education with advanced AI technology." />
                <meta name="keywords" content="LMS, Revotic AI, Learning Management System, Education Technology, Online Learning, University LMS, Student Portal" />
                <meta name="author" content="Revotic AI Pvt Ltd" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Revotic AI LMS | Next-Generation Learning Management System" />
                <meta property="og:description" content="Discover Revotic AI LMS, the premier Learning Management System for universities and modern schools." />
                <meta property="og:image" content="/branding/revoticai-new-logo-for-dark-theme.png" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Revotic AI LMS | Next-Generation Learning Management System" />
                <meta name="twitter:description" content="Discover Revotic AI LMS, the premier Learning Management System for universities and modern schools." />
                <meta name="twitter:image" content="/branding/revoticai-new-logo-for-dark-theme.png" />

                {/* Favicons */}
                <link rel="icon" type="image/x-icon" href="/branding/favicon-for-dark-theme.ico" />
                <link rel="icon" type="image/png" sizes="32x32" href="/branding/revoticai-R-icon.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/branding/revoticai-R-icon.png" />
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
