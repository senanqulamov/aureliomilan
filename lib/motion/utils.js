import { p } from '../content';

export const qs = (s, el = document) => el.querySelector(s);
export const qsa = (s, el = document) => [...el.querySelectorAll(s)];
export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;
export const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

/** srcset attributes for a photo key */
export function imgAttrs(key, { sizes = '(max-width: 860px) 92vw, 40vw', eager = false } = {}) {
  const ph = p(key);
  if (!ph) return 'alt=""';
  const set = ph.s !== ph.l ? `srcset="${ph.s} 800w, ${ph.l} 1600w" sizes="${sizes}"` : '';
  return `src="${ph.s}" ${set} data-key="${key}" width="${ph.w}" height="${ph.h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"`;
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
