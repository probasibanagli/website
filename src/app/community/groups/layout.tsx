import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Bengali Community Groups & Associations in Tamil Nadu',
  description: 'Join verified Bengali WhatsApp groups, cultural associations, Telegram channels, and Facebook communities in Chennai, Coimbatore, Vellore, and across Tamil Nadu to stay connected.',
  keywords: [
    'Bengali community Tamil Nadu',
    'Bengali WhatsApp group Chennai',
    'Bengalis in Chennai association',
    'Bengali club Chennai',
    'South India Bengali association',
    'Bengali cultural samiti Chennai',
  ],
  alternates: {
    canonical: '/community/groups',
  },
  openGraph: {
    title: 'Bengali Community Groups & Associations in Tamil Nadu | ProbasiBangali',
    description: 'Connect with local Bengali associations, cultural samitis, and community groups across Tamil Nadu.',
    url: 'https://probasibangali.in/community/groups',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bengali Community Groups & Associations in Tamil Nadu | ProbasiBangali',
    description: 'Connect with local Bengali associations, cultural samitis, and community groups across Tamil Nadu.',
  },
};

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://probasibangali.in' },
          { name: 'Community', url: 'https://probasibangali.in/community/groups' },
          { name: 'Community Groups', url: 'https://probasibangali.in/community/groups' },
        ]}
      />
      {children}
    </>
  );
}
