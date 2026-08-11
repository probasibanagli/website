import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency SOS — Ambulance, Police, Fire | ProbasiBangali',
  description: 'One-tap emergency access: Call 112, 108 ambulance, 100 police, 101 fire service. Private ambulance listings for Chennai and Tamil Nadu. No login required.',
  keywords: ['emergency Tamil Nadu', 'ambulance Chennai', 'call 112 India', 'SOS Tamil Nadu'],
};

export default function AmbulanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
