import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'College Finder — Engineering, Medical & Arts Colleges | ProbasiBangali',
  description: 'Find engineering, medical, arts and management colleges in Tamil Nadu. IIT Madras, VIT, Anna University, CMC Vellore and more with travel directions.',
  keywords: ['colleges Tamil Nadu', 'engineering colleges Chennai', 'medical colleges Tamil Nadu', 'Bengali students college'],
};

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
