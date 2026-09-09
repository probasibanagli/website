import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Blood Banks in Tamil Nadu – Search by Blood Group (A+, B+, O+, AB-)',
  description: 'Search verified 24/7 blood banks, government blood storage centers, and donor associations across Chennai, Coimbatore, Vellore, and Tamil Nadu. Filter by blood group with instant one-tap calling.',
  keywords: [
    'Blood bank Chennai',
    'Blood bank Tamil Nadu',
    'Emergency blood donor Chennai',
    'A positive blood Chennai',
    'O negative blood Chennai',
    'Platelet donation Chennai',
    'CMC Vellore blood bank',
  ],
  alternates: {
    canonical: '/emergency/blood',
  },
  openGraph: {
    title: 'Blood Banks in Tamil Nadu – Search by Blood Group | ProbasiBangali',
    description: 'Find 24/7 blood banks and donors across Chennai, Vellore, and Tamil Nadu with instant contact options.',
    url: 'https://probasibangali.in/emergency/blood',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blood Banks in Tamil Nadu – Search by Blood Group | ProbasiBangali',
    description: 'Find 24/7 blood banks and donors across Chennai, Vellore, and Tamil Nadu with instant contact options.',
  },
};

export default function BloodLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Emergency Services', url: 'https://probasibangali.in/emergency/hospitals' },
          { name: 'Blood Banks', url: 'https://probasibangali.in/emergency/blood' },
        ]}
      />
      {children}
    </>
  );
}
