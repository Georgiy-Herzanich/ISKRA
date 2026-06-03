import { useTranslations } from 'next-intl';

export default function Fab() {
  const t = useTranslations('order');
  return (
    <a href="#order" className="fab fab-contact" aria-label={t('fabLabel')}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H8l-4 4V6c0-1.1.9-2 2-2z" />
      </svg>
      <span className="fab-text">{t('fabLabel')}</span>
    </a>
  );
}
