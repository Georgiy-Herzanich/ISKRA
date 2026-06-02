import { useTranslations } from 'next-intl';

type Review = { text: string; author: string; city: string };

function Card({ r }: { r: Review }) {
  return (
    <div className="rev-card">
      <div className="rev-quote">&ldquo;</div>
      <p>{r.text}</p>
      <div className="rev-author">
        <b>{r.author}</b>
        {r.city}
      </div>
    </div>
  );
}

export default function Reviews() {
  const t = useTranslations('reviews');
  const items = t.raw('items') as Review[];
  const rowA = items.slice(0, 3);
  const rowB = items.slice(3, 6);

  // Cards are rendered twice per track so the CSS marquee (translateX -50%)
  // loops seamlessly — replaces the original innerHTML duplication.
  return (
    <section className="reviews wrap" id="reviews">
      <div className="sec-label reveal">
        <span>{t('label')}</span>
      </div>
      <div className="rev-rows reveal">
        <div className="rev-row rev-row-a">
          <div className="rev-track">
            {[...rowA, ...rowA].map((r, i) => (
              <Card r={r} key={i} />
            ))}
          </div>
        </div>
        <div className="rev-row rev-row-b">
          <div className="rev-track">
            {[...rowB, ...rowB].map((r, i) => (
              <Card r={r} key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
