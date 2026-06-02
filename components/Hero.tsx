import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('hero');
  return (
    <section className="hero">
      <div className="kicker">{t('kicker')}</div>
      <h1>{t.rich('title', { em: (chunks) => <em>{chunks}</em> })}</h1>
      <p>{t('subtitle')}</p>
      <div className="scroll">{t('scroll')}</div>
    </section>
  );
}
