'use client';

import { useEffect } from 'react';

export default function Effects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // ---- reveal on scroll ----
    const reveals = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('in'));
    } else {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -8% 0px' }
      );
      reveals.forEach((el) => obs.observe(el));
      cleanups.push(() => obs.disconnect());

      const onLoad = () => {
        setTimeout(() => {
          document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight) el.classList.add('in');
          });
        }, 600);
      };
      window.addEventListener('load', onLoad);
      cleanups.push(() => window.removeEventListener('load', onLoad));
    }

    // ---- click on pricing / packages -> scroll to order ----
    const goToOrder = () =>
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    const clickables = document.querySelectorAll<HTMLElement>('.pricing-block, .pack');
    clickables.forEach((el) => el.addEventListener('click', goToOrder));
    cleanups.push(() =>
      clickables.forEach((el) => el.removeEventListener('click', goToOrder))
    );

    // ---- main before/after slider ----
    const ba = document.getElementById('baSlider');
    if (ba) {
      let dragging = false;
      const setPos = (clientX: number) => {
        const r = ba.getBoundingClientRect();
        let p = ((clientX - r.left) / r.width) * 100;
        p = Math.max(0, Math.min(100, p));
        ba.style.setProperty('--pos', p + '%');
      };
      const onDown = (e: MouseEvent) => {
        dragging = true;
        setPos(e.clientX);
      };
      const onTouchStart = (e: TouchEvent) => {
        dragging = true;
        setPos(e.touches[0].clientX);
      };
      const onMove = (e: MouseEvent) => {
        if (dragging) setPos(e.clientX);
      };
      const onTouchMove = (e: TouchEvent) => {
        if (dragging) setPos(e.touches[0].clientX);
      };
      const onUp = () => {
        dragging = false;
      };
      ba.addEventListener('mousedown', onDown);
      ba.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
      ba.style.setProperty('--pos', '25%');
      cleanups.push(() => {
        ba.removeEventListener('mousedown', onDown);
        ba.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchend', onUp);
      });
    }

    // ---- per-card gallery before/after sliders ----
    document.querySelectorAll<HTMLElement>('.gba').forEach((card) => {
      let dragging = false;
      const setPos = (clientX: number) => {
        const r = card.getBoundingClientRect();
        let p = ((clientX - r.left) / r.width) * 100;
        p = Math.max(0, Math.min(100, p));
        card.style.setProperty('--pos', p + '%');
      };
      card.style.setProperty('--pos', '25%');
      const onDown = (e: MouseEvent) => {
        dragging = true;
        setPos(e.clientX);
      };
      const onTouchStart = (e: TouchEvent) => {
        dragging = true;
        setPos(e.touches[0].clientX);
      };
      const onMove = (e: MouseEvent) => {
        if (dragging) setPos(e.clientX);
      };
      const onTouchMove = (e: TouchEvent) => {
        if (dragging) setPos(e.touches[0].clientX);
      };
      const onUp = () => {
        dragging = false;
      };
      card.addEventListener('mousedown', onDown);
      card.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('mouseup', onUp);
      window.addEventListener('touchend', onUp);
      cleanups.push(() => {
        card.removeEventListener('mousedown', onDown);
        card.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchend', onUp);
      });
    });

    // ---- header: hide on scroll down, parallax decorations ----
    const header = document.querySelector('header');
    const rings1 = document.querySelector<HTMLElement>('.rings-1');
    const rings2 = document.querySelector<HTMLElement>('.rings-2');
    const beam = document.querySelector<HTMLElement>('.beam');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastY = window.scrollY;
    let ticking = false;

    const onScrollFrame = () => {
      const y = window.scrollY;
      header?.classList.toggle('scrolled', y > 40);
      if (y < 80) {
        header?.classList.remove('hidden');
      } else if (y > lastY + 6) {
        header?.classList.add('hidden');
      } else if (y < lastY - 6) {
        header?.classList.remove('hidden');
      }
      lastY = y;
      if (!reduceMotion) {
        if (rings1) rings1.style.transform = `translateY(${y * 0.08}px) rotate(${y * 0.02}deg)`;
        if (rings2) rings2.style.transform = `translateY(${y * -0.06}px) rotate(${y * -0.02}deg)`;
        if (beam) beam.style.transform = `rotate(8deg) translateY(${y * 0.05}px)`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(onScrollFrame);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
