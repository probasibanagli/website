import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Events, Durga Puja & Festivals in Tamil Nadu',
  description: 'Explore upcoming Durga Puja pandals, Kali Puja, Saraswati Puja, Poila Boishakh (Nabobarsho), and Bengali musical cultural nights across Chennai, Coimbatore, Vellore and Tamil Nadu.',
  keywords: [
    'Durga Puja Chennai',
    'Durga Puja pandals Chennai',
    'Bengali events Tamil Nadu',
    'Saraswati Puja Chennai',
    'Poila Boishakh Chennai celebration',
    'Bengali cultural events Tamil Nadu',
    'Kali Puja Chennai',
  ],
  alternates: {
    canonical: '/community/events',
  },
  openGraph: {
    title: 'Bengali Events, Durga Puja & Festivals in Tamil Nadu | ProbasiBangali',
    description: 'Find upcoming Durga Puja pandals, Bengali festivals, and community celebrations in Tamil Nadu.',
    url: 'https://probasibangali.in/community/events',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Events, Durga Puja & Festivals in Tamil Nadu | ProbasiBangali',
    description: 'Find upcoming Durga Puja pandals, Bengali festivals, and community celebrations in Tamil Nadu.',
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Community', url: 'https://probasibangali.in/community/groups' },
          { name: 'Bengali Events & Festivals', url: 'https://probasibangali.in/community/events' },
        ]}
      />
      {children}
    </>
  );
}
