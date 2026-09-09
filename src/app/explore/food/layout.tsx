import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://probasibangali.in';

export const metadata: Metadata = {
  title: 'Bengali Food, Mess & Restaurants in Chennai & Tamil Nadu | ProbasiBangali',
  description: 'Discover authentic Bengali food, mess, sweet shops, fish markets, tiffin services, and home delivery across Chennai, Coimbatore, Vellore and Tamil Nadu. Kolkata biryani, kosha mangsho, ilish, and mishti doi.',
  keywords: [
    'Bengali food Chennai',
    'Bangali food Chennai',
    'Bengali mess Chennai',
    'Bangali mess Chennai',
    'Bengali restaurant Tamil Nadu',
    'Bengali sweets Chennai',
    'Kolkata biryani in Chennai',
    'Bengali tiffin service Chennai',
    'Bengali fish market Chennai',
    'Mishti doi Chennai',
    'বাঙালি খাবার চেন্নাই',
    'বাঙালি মেস',
    'কলকাতা বিরিয়ানি',
    'মিষ্টি দই',
    'Probasi Bangali food',
  ],
  alternates: {
    canonical: '/explore/food',
  },
  openGraph: {
    title: 'Bengali Food, Mess & Restaurants in Tamil Nadu | ProbasiBangali',
    description: 'Find authentic Bengali restaurants, sweet shops, tiffin services, and Kolkata flavors in Tamil Nadu.',
    url: `${SITE_URL}/explore/food`,
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
          { name: 'Home', url: SITE_URL },
          { name: 'Bengali Food & Restaurants', url: `${SITE_URL}/explore/food` },
        ]}
      />
      {children}
    </>
  );
}
