import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Speaking Doctors in Chennai & Tamil Nadu',
  description: 'Find verified Bengali-speaking doctors, specialists, surgeons, and physicians in Chennai, Vellore, Coimbatore, and across Tamil Nadu hospitals with direct consultation hours and hospital affiliations.',
  keywords: [
    'Bengali doctors in Chennai',
    'Bengali speaking doctors Tamil Nadu',
    'Bengali doctors near Apollo Chennai',
    'Bengali doctors Vellore CMC',
    'Bengali cardiologist Chennai',
    'Bengali oncologist Chennai',
    'Bengali orthopedic doctor Chennai',
    'Bengali doctors directory Tamil Nadu',
  ],
  alternates: {
    canonical: '/emergency/hospitals/bengali-doctors',
  },
  openGraph: {
    title: 'Bengali Speaking Doctors in Chennai & Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali-speaking doctors, specialists, and physicians across top hospitals in Tamil Nadu.',
    url: 'https://probasibangali.in/emergency/hospitals/bengali-doctors',
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
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Hospitals & Healthcare', url: 'https://probasibangali.in/emergency/hospitals' },
          { name: 'Bengali Doctors', url: 'https://probasibangali.in/emergency/hospitals/bengali-doctors' },
        ]}
      />
      {children}
    </>
  );
}
