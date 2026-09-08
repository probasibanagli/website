import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Emergency SOS & Ambulance Services in Tamil Nadu – TN to WB ICU Ambulance',
  description: '24/7 Emergency helpline (108, 112) and verified private ambulance providers in Chennai, Vellore, and Tamil Nadu. Specialised in interstate ICU patient transport from Tamil Nadu to West Bengal (Chennai to Kolkata).',
  keywords: [
    'Ambulance Chennai',
    'Ambulance Tamil Nadu to West Bengal',
    'Chennai to Kolkata road ambulance ICU',
    'Vellore to Kolkata patient ambulance',
    'ICU ambulance Chennai',
    'Call 108 Tamil Nadu',
    'Emergency SOS Tamil Nadu',
  ],
  alternates: {
    canonical: '/emergency/ambulance',
  },
  openGraph: {
    title: 'Emergency SOS & Ambulance Services in Tamil Nadu | ProbasiBangali',
    description: 'Instant emergency SOS calling and inter-state ICU patient transport from Tamil Nadu to West Bengal.',
    url: 'https://probasibangali.in/emergency/ambulance',
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
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Emergency Services', url: 'https://probasibangali.in/emergency/hospitals' },
          { name: 'Ambulance & SOS', url: 'https://probasibangali.in/emergency/ambulance' },
        ]}
      />
      {children}
    </>
  );
}
