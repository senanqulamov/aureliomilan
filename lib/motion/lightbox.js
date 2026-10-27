// Site-wide photo viewer. Clicking any photo opens it here, with the
// other photos from the same section (or [data-lb-group]) as a set.
import gsap from 'gsap';
import { p } from '../content';
import { qs, qsa, reducedMotion } from './utils';

const SELECTOR = '.media, .gitem, .map__thumb, [data-lb]';

export function initLightbox(app) {
  const lb = qs('.lightbox');
  const img = qs('.lightbox__stage img', lb);
  const thumbs = qs('.lightbox__thumbs', lb);
  const rm = reducedMotion();
  let list = [], idx = 0, lastFocus = null, isOpen = false;

  const render = () => {
    const it = list[idx];
    img.src = p(it.key).l;
    img.alt = it.label;
    qs('.lightbox__count', lb).textContent = `${String(idx + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
    qs('.lb-label', lb).textContent = it.label;
    qsa('button', thumbs).forEach((b, i) => b.classList.toggle('is-on', i === idx));
    const on = thumbs.children[idx];
    on && on.scrollIntoView({ inline: 'center', block: 'nearest', behavior: rm ? 'auto' : 'smooth' });
  };
  const show = (dir = 0) => {
    if (rm || !dir) {
      render();
      if (!rm) gsap.fromTo(img, { autoAlpha: 0, scale: 0.94, clipPath: 'inset(8% 8% 8% 8%)' }, { autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out' });
      return;
    }
    gsap.to(img, {
      xPercent: -dir * 8, autoAlpha: 0, duration: 0.28, ease: 'power2.in',
      onComplete: () => { render(); gsap.fromTo(img, { xPercent: dir * 8, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' }); },
    });
  };
  const open = (photos, i, from) => {
    list = photos; idx = Math.max(0, i); lastFocus = from; isOpen = true;
    thumbs.innerHTML = list.map((ph, j) => `<button type="button" aria-label="Photo ${j + 1}"><img src="${p(ph.key).s}" alt=""></button>`).join('');
    qsa('button', thumbs).forEach((b, j) => b.addEventListener('click', () => { const d = j > idx ? 1 : -1; idx = j; show(d); }));
    thumbs.style.display = list.length > 1 ? '' : 'none';
    qsa('.lb-prev, .lb-next', lb).forEach((b) => (b.style.visibility = list.length > 1 ? '' : 'hidden'));
    app.lenis && app.lenis.stop();
    lb.setAttribute('aria-hidden', 'false');
    gsap.to(lb, { autoAlpha: 1, duration: rm ? 0 : 0.5, ease: 'power2.out' });
    show(0);
    qs('.lb-close', lb).focus({ preventScroll: true });
  };
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    lb.setAttribute('aria-hidden', 'true');
    gsap.to(lb, { autoAlpha: 0, duration: rm ? 0 : 0.45, ease: 'power2.inOut' });
    app.lenis && app.lenis.start();
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  };
  const step = (d) => { if (list.length < 2) return; idx = (idx + d + list.length) % list.length; show(d); };

  qs('.lb-close', lb).addEventListener('click', close);
  qs('.lb-prev', lb).addEventListener('click', () => step(-1));
  qs('.lb-next', lb).addEventListener('click', () => step(1));
  qs('.lightbox__stage', lb).addEventListener('click', (e) => { if (e.target !== img) close(); });
  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  let sx = null;
  img.addEventListener('pointerdown', (e) => (sx = e.clientX));
  img.addEventListener('pointerup', (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) step(e.clientX < sx ? 1 : -1); sx = null; });

  // Any photo on the page opens the viewer
  const itemFrom = (el) => {
    const im = el.querySelector('img[data-key]');
    if (!im) return null;
    const label = el.dataset.label || (el.querySelector('.gitem__label') || {}).textContent || im.alt || '';
    return { key: im.dataset.key, label: label.replace(/^Aurelio Milan — /, '') };
  };
  document.addEventListener('click', (e) => {
    const el = e.target.closest(SELECTOR);
    if (!el || el.closest('a') || el.closest('.lightbox') || !el.closest('#app')) return;
    const group = el.closest('[data-lb-group]') || el.closest('section') || qs('#app');
    let els = qsa(SELECTOR, group).filter((x) => !x.classList.contains('is-hidden') && x.querySelector('img[data-key]'));
    if (els.every((x) => x.dataset.i !== undefined)) els.sort((a, b) => a.dataset.i - b.dataset.i);
    const photos = els.map(itemFrom).filter(Boolean);
    const i = els.indexOf(el);
    if (!photos.length) return;
    e.preventDefault();
    open(photos, i, el);
  });

  return { open, close, isOpen: () => isOpen };
}
