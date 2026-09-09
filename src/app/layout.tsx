import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Script from 'next/script';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/chatbot/ChatWidget';
import { LiveViewCounter } from '@/components/layout/LiveViewCounter';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { GlobalLoader } from '@/components/layout/GlobalLoader';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { BlockedCheck } from '@/components/layout/BlockedCheck';
import { AlertProvider } from '@/lib/contexts/AlertContext';
import { cookies } from 'next/headers';
import { WelcomeModal } from '@/components/layout/WelcomeModal';
import { FeatureTour } from '@/components/layout/FeatureTour';
import { PageSkeletonLoader } from '@/components/ui/PageSkeletonLoader';
import { LanguageTransitionOverlay } from '@/components/layout/LanguageTransitionOverlay';

import { WebSiteJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL('https://probasibangali.in'),
  title: {
    default: 'ProbasiBangali – Bengali Community Portal in Tamil Nadu',
    template: '%s | ProbasiBangali',
  },
  description: 'Your trusted Bengali community portal in Tamil Nadu. Explore verified Bengali PG accommodation, authentic Bengali food & mess, Bengali speaking doctors, emergency healthcare assistance, inter-state ambulance, legal guidance, matrimonial matching, and cultural events across Chennai, Coimbatore, Vellore, and Tamil Nadu.',
  keywords: [
    'Probasi Bangali',
    'Bengali in Tamil Nadu',
    'Bengali PG Chennai',
    'Bengali food Chennai',
    'Bengali doctors Chennai',
    'Bengali speaking doctors Vellore',
    'Bengali mess Chennai',
    'Bengali hotel Chennai',
    'Bengali community Tamil Nadu',
    'Ambulance Chennai to Kolkata',
    'Ambulance Tamil Nadu to West Bengal',
    'Durga Puja Chennai',
    'Bengali matrimonial Tamil Nadu',
    'Bengali students Tamil Nadu',
    'CMC Vellore Bengali patient help',
  ],
  authors: [{ name: 'ProbasiBangali Community' }],
  creator: 'ProbasiBangali',
  publisher: 'ProbasiBangali',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ProbasiBangali – Bengali Community Portal in Tamil Nadu',
    description: 'Find verified Bengali PG accommodation, authentic food, Bengali speaking doctors, emergency healthcare, and community connections across Tamil Nadu.',
    url: 'https://probasibangali.in',
    siteName: 'ProbasiBangali',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ProbasiBangali – Bengali Community in Tamil Nadu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProbasiBangali – Bengali Community Portal in Tamil Nadu',
    description: 'Find verified Bengali PG accommodation, authentic food, Bengali speaking doctors, emergency healthcare, and community connections across Tamil Nadu.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const dismissed = cookieStore.get('pb_welcome_dismissed')?.value === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="welcome-dismissed-check" strategy="beforeInteractive">
          {`
            try {
              if (document.cookie.indexOf('pb_welcome_dismissed=true') > -1 || localStorage.getItem('pb_welcome_dismissed') === 'true') {
                document.documentElement.classList.add('pb-welcome-dismissed');
              }
            } catch (e) {}
          `}
        </Script>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/logo.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png?v=2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="preconnect" href="https://translate.googleapis.com" />
        <link rel="dns-prefetch" href="https://translate.google.com" />
        <link rel="dns-prefetch" href="https://translate.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Hind+Siliguri:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <div id="google_translate_element" />
        <Script id="google-translate-init" strategy="beforeInteractive">
          {`
            window.googleTranslateElementInit = function() {
              try {
                if (window.google && window.google.translate) {
                  new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'bn,ta,en',
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                  }, 'google_translate_element');
                }
              } catch (e) {
                console.warn('Google Translate Init Warning:', e);
              }
            };
          `}
        </Script>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <WebSiteJsonLd />
        <OrganizationJsonLd />
        <LanguageProvider>
          <LanguageTransitionOverlay />
          <AlertProvider>
            <AuthProvider>
              <BlockedCheck>
                <WelcomeModal initiallyOpen={!dismissed} />
                <FeatureTour />
                <Navbar />
                <Suspense fallback={<PageSkeletonLoader />}>
                  <main className="flex-1">{children}</main>
                </Suspense>
                <Footer />
                <LiveViewCounter />
                <ChatWidget />
              </BlockedCheck>
            </AuthProvider>
          </AlertProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
