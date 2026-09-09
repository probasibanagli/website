import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Travel, Metro, MTC Bus & Train Guide in Tamil Nadu',
  description: 'Plan your travel across Chennai and Tamil Nadu with MTC bus routes, Chennai Metro timing & maps, suburban trains, autos, and rides. Includes Tamil audio phrases for easy communication.',
  keywords: [
    'Chennai travel guide Bengali',
    'Tamil Nadu transport guide',
    'MTC bus routes Chennai',
    'Chennai metro route map',
    'Chennai suburban train timing',
    'Tamil phrases for Bengali travelers',
    'How to travel in Chennai for Bengalis',
  ],
  alternates: {
    canonical: '/explore/travel',
  },
  openGraph: {
    title: 'Travel, Metro, MTC Bus & Train Guide in Tamil Nadu | ProbasiBangali',
    description: 'Complete transit guide for Bengalis in Tamil Nadu: metro maps, bus routes, trains, and auto fare help.',
    url: 'https://probasibangali.in/explore/travel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel, Metro, MTC Bus & Train Guide in Tamil Nadu | ProbasiBangali',
    description: 'Complete transit guide for Bengalis in Tamil Nadu: metro maps, bus routes, trains, and auto fare help.',
  },
};

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Travel & Transport Guide', url: 'https://probasibangali.in/explore/travel' },
        ]}
      />
      {children}
    </>
  );
}
