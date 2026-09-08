import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Hospitals with Bengali Assistance in Tamil Nadu',
  description: 'Explore top multi-speciality and super-speciality hospitals across Chennai, Vellore, and Coimbatore with dedicated Bengali patient support, translation, and guest houses nearby.',
  keywords: [
    'Hospitals with Bengali help Chennai',
    'Best hospital for Bengali patients Chennai',
    'Hospitals near Greams Road Chennai',
    'Apollo Chennai Bengali helpdesk',
    'CMC Vellore Bengali helpdesk',
  ],
  alternates: {
    canonical: '/emergency/hospitals/bengali-hospitals',
  },
  openGraph: {
    title: 'Hospitals with Bengali Assistance in Tamil Nadu | ProbasiBangali',
    description: 'Top hospitals in Tamil Nadu with dedicated Bengali support, helpdesks, and patient coordination.',
    url: 'https://probasibangali.in/emergency/hospitals/bengali-hospitals',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hospitals with Bengali Assistance in Tamil Nadu | ProbasiBangali',
    description: 'Top hospitals in Tamil Nadu with dedicated Bengali support, helpdesks, and patient coordination.',
  },
};

export default function BengaliHospitalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Hospitals & Healthcare', url: 'https://probasibangali.in/emergency/hospitals' },
          { name: 'Bengali Hospitals', url: 'https://probasibangali.in/emergency/hospitals/bengali-hospitals' },
        ]}
      />
      {children}
    </>
  );
}
