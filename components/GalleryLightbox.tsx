/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

type Props = {
  before: string;
  after: string;
  afterIsVideo: boolean;
  ratio: number;
  labels: {
    before: string;
    after: string;
    expand: string;
    close: string;
    beforeAlt: string;
    afterAlt: string;
  };
};

export default function GalleryLightbox({ before, after, afterIsVideo, ratio, labels }: Props) {
  const [open, setOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const setPos = (clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    el.style.setProperty('--pos', p + '%');
  };
  const onPointerDown = (e: PointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPos(e.clientX);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (dragging.current) setPos(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

  return (
    <>
      <button
        type="button"
        className="gba-expand"
        aria-label={labels.expand}
        onClick={() => setOpen(true)}
        onPointerDown={stop}
        onMouseDown={stop}
        onTouchStart={stop}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      </button>

      {open && (
        <div className="lb" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <button
            type="button"
            className="lb-close"
            aria-label={labels.close}
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
          <div
            ref={frameRef}
            className="lb-frame"
            style={{ '--ar': String(ratio), '--pos': '25%' } as CSSProperties}
            onClick={stop}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <img className="lb-img" src={before} alt={labels.beforeAlt} />
            {afterIsVideo ? (
              <video className="lb-img lb-after" src={after} autoPlay muted loop playsInline />
            ) : (
              <img className="lb-img lb-after" src={after} alt={labels.afterAlt} />
            )}
            <span className="lb-tag lb-tag-before">{labels.before}</span>
            <span className="lb-tag lb-tag-after">{labels.after}</span>
            <div className="lb-handle"></div>
            <div className="lb-knob"></div>
          </div>
        </div>
      )}
    </>
  );
}
