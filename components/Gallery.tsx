/* eslint-disable @next/next/no-img-element */
import { useTranslations } from 'next-intl';

const SEEDS = ['iskra1', 'iskra2', 'iskra3', 'iskra4', 'iskra5', 'iskra6'];

export default function Gallery() {
  const t = useTranslations('gallery');

  return (
    <section className="gallery wrap" id="gallery">
      <div className="sec-label reveal">
        <span>{t('label')}</span>
      </div>
      <div className="gal-grid reveal">
        {SEEDS.map((seed) => (
          <div className="gal-card" key={seed}>
            <div className="gba">
              <img
                src={`https://picsum.photos/seed/${seed}/480/640?grayscale`}
                alt=""
              />
              <img
                className="gba-after"
                src={`https://picsum.photos/seed/${seed}/480/640`}
                alt=""
              />
              <span className="gba-tag gtag-before">{t('before')}</span>
              <span className="gba-tag gtag-after">{t('after')}</span>
              <div className="gba-handle"></div>
              <div className="gba-knob"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="gal-hint reveal">{t('hint')}</div>
    </section>
  );
}
