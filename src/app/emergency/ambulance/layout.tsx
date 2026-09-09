import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://probasibangali.in';

export const metadata: Metadata = {
  title: 'Emergency SOS & Ambulance in Tamil Nadu – Chennai to Kolkata ICU Ambulance',
  description: '24/7 Emergency helpline (108, 112) and verified private ambulance providers in Chennai, Vellore, and Tamil Nadu. Specialised in interstate ICU patient transport from Tamil Nadu to West Bengal (Chennai to Kolkata road ambulance).',
  keywords: [
    'Ambulance Chennai to Kolkata',
    'Chennai to Kolkata road ambulance ICU',
    'Ambulance Tamil Nadu to West Bengal',
    'Vellore to Kolkata patient ambulance',
    'ICU ambulance Chennai',
    'Emergency SOS Tamil Nadu',
    'চেন্নাই থেকে কলকাতা অ্যাম্বুলেন্স',
    'আইসিইউ অ্যাম্বুলেন্স তামিলনাড়ু',
    'Bengali patient ambulance Chennai',
    'Bangali ambulance Chennai to Kolkata',
    'Probasi Bangali ambulance',
  ],
  alternates: {
    canonical: '/emergency/ambulance',
  },
  openGraph: {
    title: 'Emergency SOS & Ambulance Services in Tamil Nadu | ProbasiBangali',
    description: 'Instant emergency SOS calling and inter-state ICU patient transport from Tamil Nadu to West Bengal.',
    url: `${SITE_URL}/emergency/ambulance`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emergency SOS & Ambulance Services in Tamil Nadu | ProbasiBangali',
    description: 'Instant emergency SOS calling and inter-state ICU patient transport from Tamil Nadu to West Bengal.',
  },
};

export default function AmbulanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Emergency Services', url: `${SITE_URL}/emergency/hospitals` },
          { name: 'Ambulance & SOS', url: `${SITE_URL}/emergency/ambulance` },
        ]}
      />
      {children}
    </>
  );
}
