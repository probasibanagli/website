import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Community Blog & Stories',
  description: 'Read inspiring stories, cultural articles, travel guides, Bengali recipes, and community updates from Bengalis living across Tamil Nadu.',
  keywords: [
    'Bengali blog Tamil Nadu',
    'Probasi Bangali stories',
    'Bengali culture Chennai',
    'Bengali festivals Tamil Nadu',
    'Bengali food experiences Chennai',
    'Durga Puja celebration Tamil Nadu',
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Bengali Community Blog & Stories | ProbasiBangali',
    description: 'Inspiring stories, cultural insights, and community updates from Bengalis in Tamil Nadu.',
    url: 'https://probasibangali.in/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Community Blog & Stories | ProbasiBangali',
    description: 'Inspiring stories, cultural insights, and community updates from Bengalis in Tamil Nadu.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Blog', url: 'https://probasibangali.in/blog' },
        ]}
      />
      {children}
    </>
  );
}
