import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Script from 'next/script';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/chatbot/ChatWidget';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { GlobalLoader } from '@/components/layout/GlobalLoader';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'ProbasiBangali – Bengali Community in Tamil Nadu',
  description: 'Find Bengali food, PG accommodation, travel help, emergency services and community connections in Tamil Nadu.',
  keywords: ['Bengali PG Chennai', 'Bengali food Tamil Nadu', 'Bengali community Chennai', 'Probasi Bangali', 'Bengali in Tamil Nadu'],
  openGraph: {
    title: 'ProbasiBangali.in',
    description: 'One-stop platform for Bengalis in Tamil Nadu — accommodation, food, travel, emergency & community.',
    url: 'https://probasibangali.in',
    siteName: 'ProbasiBangali',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/logo.png?v=2', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png?v=2' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#D85A30',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/logo.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Hind+Siliguri:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <div id="google_translate_element" style={{ display: 'none' }} />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            window.googleTranslateElementInit = function() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'bn,ta,en',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            };

            const removeBanner = () => {
              const banner = document.querySelector('.goog-te-banner-frame');
              if (banner) {
                banner.remove();
                document.body.style.top = '0px';
              }
              const skip = document.querySelector('.skiptranslate');
              if (skip) {
                skip.style.display = 'none';
              }
            };
            
            setInterval(removeBanner, 500);
          `}
        </Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <LanguageProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <GlobalLoader />
            </Suspense>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ChatWidget />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
