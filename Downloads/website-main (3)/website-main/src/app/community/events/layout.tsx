import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bengali Events & Festivals in Tamil Nadu | ProbasiBangali',
  description: 'Find Durga Puja, Saraswati Puja, Poila Boishakh and Bengali cultural events in Chennai, Coimbatore, Vellore and Tamil Nadu.',
  keywords: ['Durga Puja Chennai', 'Bengali events Tamil Nadu', 'Saraswati Puja Chennai', 'Bengali festival Tamil Nadu'],
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
