/* eslint-disable @next/next/no-img-element */
import { useTranslations } from 'next-intl';
import { getGalleryItems, type GalleryItem } from '@/lib/gallery';
import GalleryLightbox from './GalleryLightbox';

// Shown only until real works are dropped into /public/gallery.
// Varied shapes so the placeholder grid already looks like the real masonry.
const PLACEHOLDER_RATIOS = [0.75, 1, 0.7, 1.3, 0.8, 1];
const PLACEHOLDERS: GalleryItem[] = ['iskra1', 'iskra2', 'iskra3', 'iskra4', 'iskra5', 'iskra6'].map(
  (seed, i) => ({
    before: `https://picsum.photos/seed/${seed}/600/800?grayscale`,
    after: `https://picsum.photos/seed/${seed}/600/800`,
    afterIsVideo: false,
    ratio: PLACEHOLDER_RATIOS[i]
  })
);

export default function Gallery() {
  const t = useTranslations('gallery');
  const works = getGalleryItems();
  const items = works.length > 0 ? works : PLACEHOLDERS;

  return (
    <section className="gallery wrap" id="gallery">
      <div className="sec-label reveal">
        <span>{t('label')}</span>
      </div>
      <div className="gal-grid reveal">
        {items.map((item, i) => (
          <div className="gal-card" key={i}>
            <div className="gba" style={{ aspectRatio: String(item.ratio) }}>
              <img src={item.before} alt={t('beforeAlt')} />
              {item.afterIsVideo ? (
                <video
                  className="gba-after"
                  src={item.after}
                  aria-label={t('afterAlt')}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img className="gba-after" src={item.after} alt={t('afterAlt')} />
              )}
              <span className="gba-tag gtag-before">{t('before')}</span>
              <span className="gba-tag gtag-after">{t('after')}</span>
              <div className="gba-handle"></div>
              <div className="gba-knob"></div>
              <GalleryLightbox
                before={item.before}
                after={item.after}
                afterIsVideo={item.afterIsVideo}
                ratio={item.ratio}
                labels={{
                  before: t('before'),
                  after: t('after'),
                  expand: t('expand'),
                  close: t('close'),
                  beforeAlt: t('beforeAlt'),
                  afterAlt: t('afterAlt')
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="gal-hint reveal">{t('hint')}</div>
    </section>
  );
}
