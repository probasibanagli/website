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

import { WebSiteJsonLd, OrganizationJsonLd, HomeFaqJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://probasibangali.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ProbasiBangali (প্রবাসী বাঙালি) – #1 Bengali Community in Tamil Nadu | Food, Stay, Doctors, Ambulance',
    template: '%s | ProbasiBangali – Bengali Community',
  },
  description: 'Probasi Bangali (প্রবাসী বাঙালি / Probashi Bengali) – The official #1 community portal for Bengalis living in Tamil Nadu. Verified Bengali PG accommodation, authentic Bengali food & mess, Bengali speaking doctors in Chennai & CMC Vellore, 24/7 interstate ICU ambulance Chennai to Kolkata, Durga Puja events, and matrimonial matching across Chennai, Coimbatore, Vellore & Tamil Nadu.',
  keywords: [
    'bangali',
    'bengali',
    'probasi bangali',
    'probashi bengali',
    'prabasi bangali',
    'prabasi bengali',
    'probasi bangla',
    'probashi bangla',
    'probsaibangali',
    'probasibangali',
    'probasi bangali tamil nadu',
    'probashi bengali tamil nadu',
    'প্রবাসী বাঙালি',
    'প্রবাসী বাংলা',
    'বাঙালি',
    'বাঙালি মেস চেন্নাই',
    'বাঙালি খাবার তামিলনাড়ু',
    'বাঙালি ডাক্তার',
    'দুর্গাপূজা চেন্নাই',
    'bengali community in tamil nadu',
    'bangali community tamil nadu',
    'bengalis in chennai',
    'bengali in tamil nadu',
    'bengali pg chennai',
    'bengali food chennai',
    'bengali mess chennai',
    'bengali hotel chennai',
    'bengali restaurant chennai',
    'bengali sweets chennai',
    'kolkata biryani chennai',
    'bengali doctors chennai',
    'bengali speaking doctors vellore',
    'cmc vellore bengali patient help',
    'ambulance chennai to kolkata',
    'icu ambulance tamil nadu to west bengal',
    'durga puja chennai',
    'bengali association chennai',
    'bengali matrimonial tamil nadu',
    'bengali students tamil nadu',
    'bengali workers tamil nadu',
    'வங்காளி',
    'பெங்காலி சமூகம்',
    'சென்னையில் பெங்காலி உணவு',
    'சென்னையில் பெங்காலி மருத்துவர்',
  ],
  authors: [{ name: 'ProbasiBangali Community' }],
  creator: 'ProbasiBangali',
  publisher: 'ProbasiBangali',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ProbasiBangali (প্রবাসী বাঙালি) – #1 Bengali Community in Tamil Nadu',
    description: 'Connecting Bengalis across Tamil Nadu. Verified Bengali PG & food, Bengali speaking doctors, interstate ICU ambulance Chennai to Kolkata, matrimonial, and community events.',
    url: siteUrl,
    siteName: 'ProbasiBangali (প্রবাসী বাঙালি)',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ProbasiBangali (প্রবাসী বাঙালি) – Bengali Community in Tamil Nadu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProbasiBangali (প্রবাসী বাঙালি) – #1 Bengali Community in Tamil Nadu',
    description: 'Connecting Bengalis across Tamil Nadu with verified PG, authentic food, Bengali speaking doctors, ambulance, and community support.',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    'geo.region': 'IN-TN',
    'geo.placename': 'Chennai, Tamil Nadu, India',
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
        <HomeFaqJsonLd />
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
