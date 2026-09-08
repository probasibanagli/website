import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Government Services & Citizen Guide in Tamil Nadu – Aadhaar, Passport, Ration Card',
  description: 'Complete step-by-step citizen guides for Bengalis living in Tamil Nadu: Aadhaar address update, Passport Seva Kendra locations, Ration card portability (ONORC), Voter ID transfer, Police verification, Ayushman Bharat, and Driving Licence in Chennai, Coimbatore, Vellore, and Trichy.',
  keywords: [
    'Government services Tamil Nadu for migrants',
    'Aadhaar update Chennai',
    'Passport Seva Kendra Chennai',
    'Ration card portability Tamil Nadu ONORC',
    'Voter ID transfer to Tamil Nadu',
    'Police verification Chennai for tenants',
    'Ayushman Bharat hospital list Tamil Nadu',
    'Driving licence RTO Chennai',
  ],
  alternates: {
    canonical: '/services/government',
  },
  openGraph: {
    title: 'Government Services & Citizen Guide in Tamil Nadu | ProbasiBangali',
    description: 'Step-by-step guides for Aadhaar, Passport, Ration Card, Voter ID, and Citizen Services in Tamil Nadu.',
    url: 'https://probasibangali.in/services/government',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Services & Citizen Guide in Tamil Nadu | ProbasiBangali',
    description: 'Step-by-step guides for Aadhaar, Passport, Ration Card, Voter ID, and Citizen Services in Tamil Nadu.',
  },
};

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Services', url: 'https://probasibangali.in/services/government' },
          { name: 'Government Services Guide', url: 'https://probasibangali.in/services/government' },
        ]}
      />
      {children}
    </>
  );
}
