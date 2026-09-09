import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Matrimony in Tamil Nadu – Verified Brides & Grooms',
  description: 'Find your life partner within the Bengali community living in Chennai, Coimbatore, Vellore and across Tamil Nadu. Admin-verified matrimonial profiles, privacy controls, and direct interest expressions.',
  keywords: [
    'Bengali matrimony Tamil Nadu',
    'Bengali bride groom Chennai',
    'Bengali marriage Tamil Nadu',
    'Probasi Bengali matrimonial',
    'Bengali matrimony Vellore',
    'Bengali matrimony Coimbatore',
    'Bengali wedding Tamil Nadu',
    'বাঙালি বিবাহ তামিলনাড়ু',
  ],
  alternates: {
    canonical: '/community/matrimonial',
  },
  openGraph: {
    title: 'Bengali Matrimony in Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali brides & grooms in Tamil Nadu with privacy controls and admin verification.',
    url: 'https://probasibangali.in/community/matrimonial',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Matrimony in Tamil Nadu | ProbasiBangali',
    description: 'Find verified Bengali brides & grooms in Tamil Nadu with privacy controls and admin verification.',
  },
};

export default function MatrimonialLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Community', url: 'https://probasibangali.in/community/groups' },
          { name: 'Bengali Matrimony', url: 'https://probasibangali.in/community/matrimonial' },
        ]}
      />
      {children}
    </>
  );
}
