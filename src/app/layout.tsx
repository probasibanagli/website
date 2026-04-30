import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/chatbot/ChatWidget';
import { AuthProvider } from '@/lib/auth/AuthContext';

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
};

import { LanguageProvider } from '@/lib/contexts/LanguageContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Hind+Siliguri:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <AuthProvider>
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
