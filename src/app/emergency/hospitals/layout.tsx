import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Hospitals & Bengali Doctors Directory in Tamil Nadu',
  description: 'Comprehensive directory of hospitals with Bengali-speaking doctors, medical staff, 24/7 emergency departments, ICU, and blood bank facilities across Chennai, Vellore, Coimbatore, and Tamil Nadu.',
  keywords: [
    'Hospitals in Chennai for Bengali patients',
    'Bengali speaking doctors Chennai',
    'CMC Vellore Bengali patient guide',
    'Apollo Greams Road Bengali assistance',
    'MIOT Hospital Bengali help',
    'Emergency hospitals Tamil Nadu',
  ],
  alternates: {
    canonical: '/emergency/hospitals',
  },
  openGraph: {
    title: 'Hospitals & Bengali Doctors Directory in Tamil Nadu | ProbasiBangali',
    description: 'Find trusted hospitals with Bengali-speaking doctors and 24/7 emergency contacts in Tamil Nadu.',
    url: 'https://probasibangali.in/emergency/hospitals',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hospitals & Bengali Doctors Directory in Tamil Nadu | ProbasiBangali',
    description: 'Find trusted hospitals with Bengali-speaking doctors and 24/7 emergency contacts in Tamil Nadu.',
  },
};

export default function HospitalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Emergency & Health', url: 'https://probasibangali.in/emergency/hospitals' },
          { name: 'Hospitals Directory', url: 'https://probasibangali.in/emergency/hospitals' },
        ]}
      />
      {children}
    </>
  );
}
