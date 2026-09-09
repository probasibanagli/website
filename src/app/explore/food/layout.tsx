import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Food, Mess & Restaurants in Tamil Nadu',
  description: 'Discover authentic Bengali restaurants, sweet shops, fish markets, tiffin services, and home delivery across Chennai, Coimbatore, Vellore and Tamil Nadu. Kolkata biryani, kosha mangsho, ilish, and mishti doi.',
  keywords: [
    'Bengali food Chennai',
    'Bengali restaurant Tamil Nadu',
    'Bengali sweets Chennai',
    'Kolkata biryani in Chennai',
    'Bengali mess Chennai',
    'Bengali tiffin service Chennai',
    'Bengali fish market Chennai',
    'Mishti doi Chennai',
  ],
  alternates: {
    canonical: '/explore/food',
  },
  openGraph: {
    title: 'Bengali Food, Mess & Restaurants in Tamil Nadu | ProbasiBangali',
    description: 'Find authentic Bengali restaurants, sweet shops, tiffin services, and Kolkata flavors in Tamil Nadu.',
    url: 'https://probasibangali.in/explore/food',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Food, Mess & Restaurants in Tamil Nadu | ProbasiBangali',
    description: 'Find authentic Bengali restaurants, sweet shops, tiffin services, and Kolkata flavors in Tamil Nadu.',
  },
};

export default function FoodLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Bengali Food & Restaurants', url: 'https://probasibangali.in/explore/food' },
        ]}
      />
      {children}
    </>
  );
}
