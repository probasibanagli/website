import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bengali PG, Hotels & Accommodation in Tamil Nadu | ProbasiBangali',
  description: 'Find Bengali-friendly PGs, hotels, and rental houses across Chennai, Coimbatore, Vellore and more. Verified listings with Bengali food, WiFi, AC.',
  keywords: ['Bengali PG Chennai', 'Bengali accommodation Tamil Nadu', 'Bengali friendly hotel', 'PG for Bengali students'],
};

export default function StayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
