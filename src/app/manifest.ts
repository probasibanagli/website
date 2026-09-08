import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ProbasiBangali – Bengali Community in Tamil Nadu',
    short_name: 'ProbasiBangali',
    description: 'Find Bengali food, PG accommodation, travel help, emergency services and community connections across Tamil Nadu.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#D85A30',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
