import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Hospital Staff & Patient Coordinators in Tamil Nadu',
  description: 'Connect with verified Bengali-speaking nurses, administrative staff, interpreters, and patient care coordinators in Chennai and Tamil Nadu hospitals for hassle-free medical assistance.',
  keywords: [
    'Bengali hospital staff Chennai',
    'Bengali patient coordinator Chennai',
    'Bengali medical interpreter Tamil Nadu',
    'Bengali nursing staff Chennai',
    'Hospital help for Bengali patients Chennai',
  ],
  alternates: {
    canonical: '/emergency/hospitals/bengali-staff',
  },
  openGraph: {
    title: 'Bengali Hospital Staff & Patient Coordinators | ProbasiBangali',
    description: 'Find Bengali-speaking healthcare staff, coordinators, and medical interpreters across Tamil Nadu.',
    url: 'https://probasibangali.in/emergency/hospitals/bengali-staff',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Hospital Staff & Patient Coordinators | ProbasiBangali',
    description: 'Find Bengali-speaking healthcare staff, coordinators, and medical interpreters across Tamil Nadu.',
  },
};

export default function BengaliStaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Hospitals & Healthcare', url: 'https://probasibangali.in/emergency/hospitals' },
          { name: 'Bengali Staff', url: 'https://probasibangali.in/emergency/hospitals/bengali-staff' },
        ]}
      />
      {children}
    </>
  );
}
