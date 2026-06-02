// Central place to edit business contact details. These are placeholders —
// replace them with the real ones before going live.
export const site = {
  name: 'ISKRA',
  // Full public URL of the deployed site (no trailing slash). Used for SEO.
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://iskra-sand.vercel.app',
  // Digits only, international format without "+" — used in wa.me links.
  whatsapp: '421950420745',
  // Human-readable phone for display.
  phoneDisplay: '+421 950 420 745',
  // tel: link value.
  phoneHref: '+421950420745',
  email: 'georgijherzanich@gmail.com'
};
