import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'College Finder – Engineering, Medical & Arts Colleges in Tamil Nadu',
  description: 'Find top colleges and universities across Tamil Nadu for Bengali students: IIT Madras, VIT Vellore, SRM, Anna University, CMC Vellore, Loyola College, and NIT Trichy. Campus info, transit options, and Bengali student connections.',
  keywords: [
    'Colleges in Tamil Nadu for Bengali students',
    'Engineering colleges Chennai',
    'Medical colleges Tamil Nadu',
    'VIT Vellore Bengali students',
    'IIT Madras Bengali community',
    'SRM Kattankulathur Bengali students',
    'CMC Vellore courses',
  ],
  alternates: {
    canonical: '/services/college',
  },
  openGraph: {
    title: 'College Finder – Top Colleges in Tamil Nadu | ProbasiBangali',
    description: 'Find engineering, medical, and arts colleges in Tamil Nadu with transit directions and student advice.',
    url: 'https://probasibangali.in/services/college',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'College Finder – Top Colleges in Tamil Nadu | ProbasiBangali',
    description: 'Find engineering, medical, and arts colleges in Tamil Nadu with transit directions and student advice.',
  },
};

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Services', url: 'https://probasibangali.in/services/government' },
          { name: 'College Finder', url: 'https://probasibangali.in/services/college' },
        ]}
      />
      {children}
    </>
  );
}
