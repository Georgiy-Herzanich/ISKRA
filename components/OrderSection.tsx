'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { site } from '@/lib/site';

type Status = 'idle' | 'sending' | 'success' | 'error' | 'invalid';

export default function OrderSection() {
  const t = useTranslations('order');
  const locale = useLocale();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t('waMessage'))}`;

  async function handleSubmit() {
    if (status === 'sending') return;
    if (!name.trim() || !contact.trim()) {
      setStatus('invalid');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, message, locale })
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setName('');
      setContact('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  }

  const noteText =
    status === 'success'
      ? t('form.success')
      : status === 'error'
        ? t('form.error')
        : status === 'invalid'
          ? t('form.validation')
          : t('form.note');

  const submitting = status === 'sending';

  return (
    <section className="final wrap reveal" id="order">
      <h2>{t.rich('title', { em: (c) => <em>{c}</em> })}</h2>
      <p>{t('subtitle')}</p>

      {/* Primary: WhatsApp */}
      <a href={waHref} className="wa-cta" target="_blank" rel="noopener">
        <span className="wa-ic">
          <svg viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.7 1.8c.1.2.1.4 0 .5l-.3.5c-.1.2-.3.3-.1.6.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.8c.2-.2.4-.2.6-.1l1.7.8c.2.1.4.2.5.3.1.2.1.7-.1 1.3z" />
          </svg>
        </span>
        <span className="wa-text">
          <span className="wa-title">{t('waTitle')}</span>
          <span className="wa-sub">{t('waSub')}</span>
        </span>
        <span className="wa-arrow">→</span>
      </a>

      {/* Direct contacts: phone + email, right under WhatsApp */}
      <div className="contacts-row">
        <a href={`tel:${site.phoneHref}`} className="ct-item">
          <span className="ct-icon">
            <svg viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
            </svg>
          </span>
          <span className="ct-text">
            <span className="ct-label">{t('contacts.phoneLabel')}</span>
            <span className="ct-val">{site.phoneDisplay}</span>
          </span>
        </a>

        <a href={`mailto:${site.email}`} className="ct-item">
          <span className="ct-icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4v10h16V8l-8 5-8-5zm0-2 8 5 8-5H4z" />
            </svg>
          </span>
          <span className="ct-text">
            <span className="ct-label">{t('contacts.emailLabel')}</span>
            <span className="ct-val">{site.email}</span>
          </span>
        </a>
      </div>

      <div className="alt-sep">
        <span>{t('altSep')}</span>
      </div>

      <div className="order-grid">
        {/* Simple contact form */}
        <div className="form-card">
          <div className="field">
            <label htmlFor="name">{t('form.nameLabel')}</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              placeholder={t('form.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="contact">{t('form.contactLabel')}</label>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder={t('form.contactPlaceholder')}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="msg">{t('form.messageLabel')}</label>
            <input
              type="text"
              id="msg"
              name="message"
              placeholder={t('form.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn"
            style={{ fontFamily: 'var(--body)' }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? t('form.sending') : t('form.submit')}
          </button>
          <div
            className={
              status === 'success'
                ? 'form-note is-success'
                : status === 'error'
                  ? 'form-note is-error'
                  : status === 'invalid'
                    ? 'form-note is-invalid'
                    : 'form-note'
            }
            role={status === 'success' || status === 'error' ? 'status' : undefined}
            aria-live="polite"
          >
            {noteText}
          </div>
        </div>
      </div>
    </section>
  );
}
