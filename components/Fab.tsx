import { useTranslations } from 'next-intl';
import { site } from '@/lib/site';

export default function Fab() {
  const t = useTranslations('order');
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('waMessage'))}`;
  return (
    <a
      href={href}
      className="fab fab-wa"
      target="_blank"
      rel="noopener"
      aria-label={t('waTitle')}
    >
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.7 1.8c.1.2.1.4 0 .5l-.3.5c-.1.2-.3.3-.1.6.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.8c.2-.2.4-.2.6-.1l1.7.8c.2.1.4.2.5.3.1.2.1.7-.1 1.3z" />
      </svg>
    </a>
  );
}
