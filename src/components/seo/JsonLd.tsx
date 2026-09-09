import React from 'react';

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://probasibangali.in';

export function OrganizationJsonLd({
  name = 'ProbasiBangali',
  url = SITE_URL,
  logo = `${SITE_URL}/logo.png`,
  description = 'Official Bengali community platform in Tamil Nadu connecting Bengalis with PG accommodation, authentic food and mess, Bengali speaking doctors, emergency healthcare, ambulance, and community events.',
}: OrganizationJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    alternateName: [
      'Probasi Bangali',
      'Probashi Bengali',
      'Prabasi Bangali',
      'Prabasi Bengali',
      'Probashi Bangla',
      'Probasi Bangla',
      'Probsaibangali',
      'probasibangali',
      'প্রবাসী বাঙালি',
      'প্রবাসী বাংলা',
      'বাঙালি',
      'Bengali Community Tamil Nadu',
      'Bangali Community Tamil Nadu',
      'Bengalis in Chennai',
      'பெங்காலி சமூகம் தமிழ்நாடு',
      'வங்காளி',
    ],
    url,
    logo,
    description,
    disambiguatingDescription: 'Probasi Bangali (প্রবাসী বাঙালি) is the premier community portal serving Bengali-speaking residents, students, professionals, and medical patients across Tamil Nadu.',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    areaServed: [
      { '@type': 'City', name: 'Chennai' },
      { '@type': 'City', name: 'Coimbatore' },
      { '@type': 'City', name: 'Madurai' },
      { '@type': 'City', name: 'Tiruchirappalli' },
      { '@type': 'City', name: 'Vellore' },
      { '@type': 'City', name: 'Salem' },
    ],
    knowsLanguage: ['en', 'bn', 'ta'],
    knowsAbout: [
      'Bengali Community in Tamil Nadu',
      'Bengali Food and Mess in Chennai',
      'Bengali Speaking Doctors in Chennai and CMC Vellore',
      'Interstate Ambulance Chennai to Kolkata',
      'Bengali PG Accommodation in Tamil Nadu',
      'Durga Puja in Chennai and Tamil Nadu',
      'Bengali Matrimonial in Tamil Nadu',
    ],
    sameAs: [
      'https://facebook.com/probasibangali',
      'https://instagram.com/probasibangali',
      'https://twitter.com/probasibangali',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteJsonLdProps {
  name?: string;
  url?: string;
}

export function WebSiteJsonLd({
  name = 'ProbasiBangali',
  url = SITE_URL,
}: WebSiteJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    alternateName: [
      'Probasi Bangali',
      'Probashi Bengali',
      'Prabasi Bangali',
      'Prabasi Bengali',
      'Probashi Bangla',
      'Probasi Bangla',
      'Probsaibangali',
      'প্রবাসী বাঙালি',
      'প্রবাসী বাংলা',
      'বাঙালি',
      'Bengali Community Portal',
    ],
    url,
    inLanguage: ['en-IN', 'bn-IN', 'ta-IN'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/explore/stay?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function HomeFaqJsonLd() {
  const defaultFaqs: FAQItem[] = [
    {
      question: 'What is Probasi Bangali (প্রবাসী বাঙালি / Probashi Bengali)?',
      answer: 'Probasi Bangali (also searched as Probashi Bengali, Prabasi Bangali, or প্রবাসী বাঙালি) is the premier community platform for Bengali-speaking people living in Tamil Nadu. It provides verified directories for Bengali PG accommodation, authentic Bengali food and mess, Bengali speaking doctors in Chennai & CMC Vellore, interstate ICU road ambulance from Tamil Nadu to West Bengal, matrimonial matches, and cultural festivals like Durga Puja.',
    },
    {
      question: 'Where can I find authentic Bengali food, mess, and sweets in Chennai & Tamil Nadu?',
      answer: 'Probasi Bangali features a curated directory of authentic Bengali restaurants, daily mess services, sweets (mishti doi, roshogolla), fish markets, and tiffin providers across Chennai (T. Nagar, Velachery, Central, Anna Nagar), Coimbatore, and Vellore.',
    },
    {
      question: 'How to find Bengali speaking doctors in Chennai and CMC Vellore?',
      answer: 'Probasi Bangali lists verified Bengali speaking doctors, healthcare specialists, and patient care assistants in top hospitals across Chennai and CMC Vellore to help patients and families communicate comfortably.',
    },
    {
      question: 'How can I book an interstate ambulance from Chennai / Tamil Nadu to Kolkata / West Bengal?',
      answer: 'Through Probasi Bangali emergency services, you can directly contact verified 24/7 private ICU road ambulances equipped with ventilators, monitors, and oxygen support for patient transport from Chennai, Vellore, and Tamil Nadu to Kolkata and West Bengal.',
    },
    {
      question: 'How do I connect with the Bengali community in Tamil Nadu?',
      answer: 'You can explore verified WhatsApp and Telegram community groups, participate in cultural and Durga Puja events, and register for Bengali matrimonial connections across Tamil Nadu on probasibangali.in.',
    },
  ];

  return <FAQJsonLd items={defaultFaqs} />;
}
