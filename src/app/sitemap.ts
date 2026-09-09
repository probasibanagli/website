import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://probasibangali.in';
  const now = new Date();

  return [
    // Home
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },

    // Explore Hubs
    { url: `${baseUrl}/explore/stay`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/explore/food`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/explore/travel`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },

    // Emergency & Healthcare (High Priority)
    { url: `${baseUrl}/emergency/hospitals`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/emergency/hospitals/bengali-doctors`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/emergency/hospitals/bengali-staff`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/emergency/hospitals/bengali-hospitals`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/emergency/ambulance`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/emergency/blood`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },

    // Community
    { url: `${baseUrl}/community/groups`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/community/matrimonial`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/community/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },

    // Services
    { url: `${baseUrl}/services/legal`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services/college`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/services/government/aadhaar`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/passport`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/ration-card`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/voter-id`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/driving-licence`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/police-verification`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/ayushman-bharat`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/visa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services/government/biometrics`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Blog
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
