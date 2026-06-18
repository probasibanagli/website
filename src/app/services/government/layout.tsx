import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Government Services & Portals | ProbasiBangali',
  description: 'Quick access to Aadhaar, ration card, driving licence, passport, voter ID and other government services in Tamil Nadu. Direct links to official portals.',
  keywords: ['government services Tamil Nadu', 'Aadhaar update Tamil Nadu', 'ration card Tamil Nadu', 'passport seva'],
};

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
