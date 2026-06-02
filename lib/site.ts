// Central place to edit business contact details. These are placeholders —
// replace them with the real ones before going live.
export const site = {
  name: 'ISKRA',
  // Full public URL of the deployed site (no trailing slash). Used for SEO.
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://iskra.example.com',
  // Digits only, international format without "+" — used in wa.me links.
  whatsapp: '380000000000',
  // Human-readable phone for display.
  phoneDisplay: '+380 00 000 00 00',
  // tel: link value.
  phoneHref: '+380000000000',
  email: 'hello@example.com'
};
