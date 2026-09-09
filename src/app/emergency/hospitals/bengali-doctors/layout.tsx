import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://probasibangali.in';

export const metadata: Metadata = {
  title: 'Bengali Speaking Doctors in Chennai & CMC Vellore, Tamil Nadu | ProbasiBangali',
  description: 'Find verified Bengali-speaking doctors, specialists, surgeons, and physicians in Chennai, CMC Vellore, Coimbatore, and across Tamil Nadu hospitals with direct consultation hours and hospital affiliations.',
  keywords: [
    'Bengali doctors in Chennai',
    'Bangali doctors in Chennai',
    'Bengali speaking doctors Tamil Nadu',
    'Bengali doctors near Apollo Chennai',
    'Bengali doctors Vellore CMC',
    'CMC Vellore Bengali patient help',
    'Bengali cardiologist Chennai',
    'Bengali oncologist Chennai',
    'Bengali orthopedic doctor Chennai',
    'Bengali doctors directory Tamil Nadu',
    'বাঙালি ডাক্তার চেন্নাই',
    'সিএমসি ভেলোর বাঙালি ডাক্তার',
    'Probasi Bangali doctors',
  ],
  alternates: {
    canonical: '/emergency/hospitals/bengali-doctors',
  },
  openGraph: {
    title: 'Bengali Speaking Doctors in Chennai & Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali-speaking doctors, specialists, and physicians across top hospitals in Tamil Nadu.',
    url: `${SITE_URL}/emergency/hospitals/bengali-doctors`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Speaking Doctors in Chennai & Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali-speaking doctors, specialists, and physicians across top hospitals in Tamil Nadu.',
  },
};

export default function BengaliDoctorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Hospitals & Healthcare', url: `${SITE_URL}/emergency/hospitals` },
          { name: 'Bengali Doctors', url: `${SITE_URL}/emergency/hospitals/bengali-doctors` },
        ]}
      />
      {children}
    </>
  );
}
