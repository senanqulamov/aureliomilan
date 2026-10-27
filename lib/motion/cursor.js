import gsap from 'gsap';
import { isTouch, reducedMotion } from './utils';

export function initCursor() {
  if (isTouch() || reducedMotion()) return;
  document.documentElement.classList.add('has-cursor');
  const el = document.querySelector('.cursor');
  const dot = el.querySelector('.cursor__dot');
  const ring = el.querySelector('.cursor__ring');
  const label = el.querySelector('.cursor__label');

  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

  let shown = false;
  window.addEventListener('pointermove', (e) => {
    if (!shown) { shown = true; gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); gsap.to(el, { autoAlpha: 1, duration: 0.4 }); }
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, input, textarea, .gitem, .media, .map__thumb');
    el.classList.remove('is-label', 'is-hover');
    if (!t || t.closest('.lightbox')) { if (t) el.classList.add('is-hover'); return; }
    const text = t.dataset.cursor || (t.matches('.gitem, .media, .map__thumb') ? 'View' : '');
    if (text) { label.textContent = text; el.classList.add('is-label'); }
    else el.classList.add('is-hover');
  });
  document.documentElement.addEventListener('pointerleave', () => gsap.to(el, { autoAlpha: 0, duration: 0.3 }));
  document.documentElement.addEventListener('pointerenter', () => gsap.to(el, { autoAlpha: 1, duration: 0.3 }));
}

/** Elements with [data-magnetic] lean toward the pointer */
export function magnetic(root = document) {
  if (isTouch() || reducedMotion()) return () => {};
  const offs = [];
  root.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.35;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const move = (e) => {
      const b = el.getBoundingClientRect();
      xTo((e.clientX - (b.left + b.width / 2)) * strength);
      yTo((e.clientY - (b.top + b.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    offs.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
  });
  return () => offs.forEach((f) => f());
}
