import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Government Services & Portals | ProbasiBangali',
  description: 'Quick access to Aadhaar, Passport, Visa applications, Police Verification, Voter ID, ration card, driving licence and other essential government services in Tamil Nadu. Online portals and offline centre locations.',
  keywords: ['government services Tamil Nadu', 'Aadhaar update Tamil Nadu', 'passport seva kendra', 'visa application Chennai', 'police verification Tamil Nadu', 'voter ID registration', 'ration card Tamil Nadu'],
};

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
