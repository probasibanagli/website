import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hospitals & Bengali Doctors in Tamil Nadu | ProbasiBangali',
  description: 'Find hospitals with Bengali-speaking doctors in Chennai, Coimbatore, Vellore. Filter by specialization. 24/7 emergency contacts with one-tap calling.',
  keywords: ['Bengali doctor Chennai', 'hospitals Tamil Nadu', 'Bengali speaking doctor', 'emergency hospital Chennai'],
};

export default function HospitalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
