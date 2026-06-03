/* eslint-disable @next/next/no-img-element */
import { useTranslations } from 'next-intl';
import VideoPlayer from '@/components/VideoPlayer';

const PILLS = [
  { range: '3–5', discount: '−10%' },
  { range: '6–10', discount: '−20%' },
  { range: '11+', discount: '−30%' }
];

// Render a service name with any "+" highlighted in gold.
function goldPlus(text: string) {
  return text
    .split('+')
    .flatMap((part, i) =>
      i === 0 ? [part] : [<span key={i} className="plus">+</span>, part]
    );
}

export default function Services() {
  const t = useTranslations('services');
  const tg = useTranslations('gallery');

  return (
    <section className="services wrap">
      <div className="sec-label reveal">
        <span>{t('label')}</span>
      </div>

      {/* Service 1: Restoration */}
      <div className="service service-restore reveal">
        <div className="s-visual">
          <div className="ba" id="baSlider">
            <img
              className="ba-before"
              src="/gallery/5-before.png"
              alt={tg('beforeAlt')}
            />
            <img
              className="ba-after"
              src="/gallery/5-after.jpg"
              alt={tg('afterAlt')}
            />
            <div className="ba-tag tag-before">{tg('before')}</div>
            <div className="ba-tag tag-after">{tg('after')}</div>
            <div className="ba-handle"></div>
            <div className="ba-knob"></div>
          </div>
        </div>
        <div className="s-text">
          <h2>{t.rich('restore.title', { em: (c) => <em>{c}</em> })}</h2>
          <p className="lead">{t('restore.lead')}</p>
          <div className="pricing-block">
            <div className="price-row">
              <div className="name">
                {goldPlus(t('restore.price1Name'))}
                <small>{t('restore.price1Small')}</small>
              </div>
              <div className="val">{t('restore.price1Val')}</div>
            </div>
            <div className="price-row">
              <div className="name">
                {goldPlus(t('restore.price2Name'))}
                <small>{t('restore.price2Small')}</small>
              </div>
              <div className="val">{t('restore.price2Val')}</div>
            </div>
            <div className="discount-note">{t('restore.discountNote')}</div>
            <div className="discount-pills">
              {PILLS.map((p) => (
                <div className="pill" key={p.range}>
                  {p.range} {t('restore.photos')} · <b>{p.discount}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service 2: Gift videos */}
      <div className="service service-video reveal">
        <VideoPlayer src="/media/memory.mp4#t=0.5" label={t('video.caption')} />
        <div className="s-text">
          <h2>{t.rich('video.title', { em: (c) => <em>{c}</em> })}</h2>
          <p className="lead">{t('video.lead')}</p>
        </div>
      </div>

      {/* Cue: prices for gift video follow */}
      <div className="packs-cue reveal">
        <span>{t('packsCue')}</span>
      </div>

      {/* Video packages */}
      <div className="packs reveal">
        <div className="pack">
          <div className="p-name">{t('packs.miniName')}</div>
          <div className="p-photos">{t('packs.miniPhotos')}</div>
          <div className="p-price">
            <sup>€</sup>29
          </div>
          <div className="p-desc">{t('packs.miniDesc')}</div>
        </div>
        <div className="pack feat">
          <div className="badge">{t('packs.familyBadge')}</div>
          <div className="p-name">{t('packs.familyName')}</div>
          <div className="p-photos">{t('packs.familyPhotos')}</div>
          <div className="p-price">
            <sup>€</sup>59
          </div>
          <div className="p-desc">{t('packs.familyDesc')}</div>
        </div>
        <div className="pack">
          <div className="p-name">{t('packs.largeName')}</div>
          <div className="p-photos">{t('packs.largePhotos')}</div>
          <div className="p-price">
            <sup>€</sup>99
          </div>
          <div className="p-desc">{t('packs.largeDesc')}</div>
        </div>
      </div>
      <div className="includes reveal">
        {t.rich('includes', { b: (c) => <b>{c}</b> })}
      </div>
    </section>
  );
}
