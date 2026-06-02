import { useTranslations } from 'next-intl';

export default function Statement() {
  const t = useTranslations('statement');
  return (
    <section className="statement wrap reveal">
      <p>{t.rich('text', { em: (chunks) => <em>{chunks}</em> })}</p>
    </section>
  );
}
