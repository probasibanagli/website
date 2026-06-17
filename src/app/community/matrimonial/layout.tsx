import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bengali Matrimony in Tamil Nadu | ProbasiBangali',
  description: 'Find your perfect Bengali life partner in Tamil Nadu. Admin-verified profiles with education, profession, family details, and community information. Free registration for Bengali brides & grooms.',
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
  openGraph: {
    title: 'Bengali Matrimony — ProbasiBangali',
    description: 'Find verified Bengali brides & grooms in Tamil Nadu. Free registration, admin-verified profiles.',
    type: 'website',
  },
};

export default function MatrimonialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
