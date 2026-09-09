import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://probasibangali.in';

export const metadata: Metadata = {
  title: 'Bengali PG, Mess & Accommodation in Tamil Nadu – Chennai, Vellore',
  description: 'Find verified Bengali-friendly PGs, mess, guest houses, and lodges across Chennai, Coimbatore, Vellore, and Tamil Nadu. Includes authentic Bengali home food, AC, WiFi, and proximity to hospitals & colleges.',
  keywords: [
    'Bengali PG Chennai',
    'Bangali PG Chennai',
    'Bengali accommodation Tamil Nadu',
    'Bengali guest house near Apollo Chennai',
    'Bengali lodge near CMC Vellore',
    'Bengali PG OMR Chennai',
    'Bengali PG Guindy Chennai',
    'PG for Bengali students Chennai',
    'Bengali food PG Chennai',
    'বাঙালি মেস চেন্নাই',
    'বাঙালি পিজি',
    'Probasi Bangali stay',
    'Probashi Bengali Chennai hostel',
  ],
  alternates: {
    canonical: '/explore/stay',
  },
  openGraph: {
    title: 'Bengali PG, Mess & Accommodation in Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali-friendly PGs, guest houses, and hotels across Chennai, Vellore, and Tamil Nadu.',
    url: `${SITE_URL}/explore/stay`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali PG, Mess & Accommodation in Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali-friendly PGs, guest houses, and hotels across Chennai, Vellore, and Tamil Nadu.',
  },
};

export default function StayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Explore Accommodation', url: `${SITE_URL}/explore/stay` },
        ]}
      />
      {children}
    </>
  );
}
