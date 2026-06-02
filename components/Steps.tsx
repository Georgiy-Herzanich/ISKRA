import { useTranslations } from 'next-intl';

const NUMERALS = ['i.', 'ii.', 'iii.'];

type Step = { title: string; text: string };

export default function Steps() {
  const t = useTranslations('steps');
  const items = t.raw('items') as Step[];

  return (
    <section className="steps wrap">
      <div className="sec-label reveal">
        <span>{t('label')}</span>
      </div>
      <div className="step-grid">
        {items.map((step, i) => (
          <div className="step reveal" key={i}>
            <div className="num">{NUMERALS[i]}</div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
