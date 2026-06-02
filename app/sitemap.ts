import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    sk: `${site.url}/`,
    uk: `${site.url}/uk`,
    en: `${site.url}/en`
  };
  const lastModified = new Date();

  return [
    { url: `${site.url}/`, lastModified, alternates: { languages } },
    { url: `${site.url}/uk`, lastModified, alternates: { languages } },
    { url: `${site.url}/en`, lastModified, alternates: { languages } }
  ];
}
