import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali PG, Hotels & Accommodation in Tamil Nadu',
  description: 'Find verified Bengali-friendly PGs, guest houses, lodges, and service apartments across Chennai, Coimbatore, Vellore, and Madurai. Includes Bengali home-cooked food, WiFi, AC, and proximity to hospitals & IT hubs.',
  keywords: [
    'Bengali PG Chennai',
    'Bengali accommodation Tamil Nadu',
    'Bengali guest house near Apollo Chennai',
    'Bengali lodge near CMC Vellore',
    'Bengali PG OMR Chennai',
    'Bengali PG Guindy Chennai',
    'PG for Bengali students Chennai',
    'Bengali food PG Chennai',
  ],
  alternates: {
    canonical: '/explore/stay',
  },
  openGraph: {
    title: 'Bengali PG, Hotels & Accommodation in Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali-friendly PGs, guest houses, and hotels across Chennai, Vellore, and Tamil Nadu.',
    url: 'https://probasibangali.in/explore/stay',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali PG, Hotels & Accommodation in Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali-friendly PGs, guest houses, and hotels across Chennai, Vellore, and Tamil Nadu.',
  },
};

export default function StayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Explore Accommodation', url: 'https://probasibangali.in/explore/stay' },
        ]}
      />
      {children}
    </>
  );
}
