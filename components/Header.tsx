'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

const OPTIONS: { code: Locale; labelKey: 'ua' | 'en' | 'sk'; display: string }[] = [
  { code: 'uk', labelKey: 'ua', display: 'UA' },
  { code: 'en', labelKey: 'en', display: 'EN' },
  { code: 'sk', labelKey: 'sk', display: 'SK' }
];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const switchRef = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[2];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (switchRef.current && !switchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function selectLocale(code: Locale) {
    setOpen(false);
    if (code === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  }

  return (
    <header>
      <nav className="nav">
        <a href="#top" className="brand" aria-label="ISKRA — наверх">
          ISKRA<span>.</span>
        </a>
        <div className="nav-right">
          <div className="lang-switch" id="langSwitch" ref={switchRef}>
            <button
              className="lang-trigger"
              id="langTrigger"
              aria-haspopup="true"
              aria-expanded={open}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
              </svg>
              <span className="lang-current" id="langCurrent">
                {current.display}
              </span>
            </button>
            <div
              className={`lang-menu${open ? ' open' : ''}`}
              id="langMenu"
              role="menu"
            >
              {OPTIONS.map((o) => (
                <button
                  key={o.code}
                  className={`lang-opt${o.code === locale ? ' active' : ''}`}
                  role="menuitem"
                  onClick={() => selectLocale(o.code)}
                >
                  {t(`lang.${o.labelKey}`)}
                </button>
              ))}
            </div>
          </div>
          <a href="#order" className="cta">
            {t('nav.cta')}
          </a>
        </div>
      </nav>
    </header>
  );
}
