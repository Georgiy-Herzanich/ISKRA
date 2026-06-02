import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer>
      <div className="brand">
        ISKRA<span style={{ color: 'var(--gold)' }}>.</span>
      </div>
      <div>{t('tagline')}</div>
      <div style={{ marginTop: '10px', opacity: 0.6 }}>{t('copyright')}</div>
    </footer>
  );
}
