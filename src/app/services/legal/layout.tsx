import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Lawyers & Legal Services in Tamil Nadu',
  description: 'Connect with verified Bengali-speaking advocates, lawyers and legal consultants in Chennai and across Tamil Nadu for property verification, documentation, civil, and corporate legal assistance.',
  keywords: [
    'Bengali lawyers Chennai',
    'Bengali advocate Tamil Nadu',
    'Bengali legal consultation Chennai',
    'Bengali property lawyer Chennai',
    'Legal documentation assistance Tamil Nadu',
  ],
  alternates: {
    canonical: '/services/legal',
  },
  openGraph: {
    title: 'Bengali Lawyers & Legal Services in Tamil Nadu | ProbasiBangali',
    description: 'Find trusted Bengali-speaking advocates and legal assistance across Tamil Nadu.',
    url: 'https://probasibangali.in/services/legal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Lawyers & Legal Services in Tamil Nadu | ProbasiBangali',
    description: 'Find trusted Bengali-speaking advocates and legal assistance across Tamil Nadu.',
  },
};

export default function LegalServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Services', url: 'https://probasibangali.in/services/government' },
          { name: 'Legal Services', url: 'https://probasibangali.in/services/legal' },
        ]}
      />
      {children}
    </>
  );
}
