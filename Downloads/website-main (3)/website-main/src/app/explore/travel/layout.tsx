import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel & Transport Guide in Tamil Nadu | ProbasiBangali',
  description: 'Plan your route with bus, metro, train, auto and cab options in Tamil Nadu. Includes Tamil word helper, Google Maps directions, and ride booking links.',
  keywords: ['Chennai travel guide Bengali', 'Tamil Nadu transport', 'MTC bus Chennai', 'metro Chennai route'],
};

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
