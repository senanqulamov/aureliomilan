import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { qsa, reducedMotion } from './utils';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const EASE = 'expo.out';

// Entrance gate: animations above the fold wait until the curtain/preloader has lifted.
let _open;
export const gate = {
  p: Promise.resolve(),
  close() { this.p = new Promise((r) => (_open = r)); },
  open() { _open && _open(); },
};
/** Run fn once el scrolls into view (and the gate is open). */
export function onView(el, fn, start = 'top 90%') {
  return ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => gate.p.then(fn) });
}

/** Split into masked lines (+ optional chars). Returns SplitText instance. */
export function splitLines(el, type = 'lines') {
  return SplitText.create(el, {
    type,
    mask: 'lines',
    linesClass: 'line',
    charsClass: 'char',
    wordsClass: 'word',
    aria: 'auto',
  });
}

// Skeleton loading
// Every photo sits on a grey skeleton until (1) it has loaded and
// (2) it has been on screen for a short beat, so the loading state is
// always seen once — briefly, never on repeat. Photos entering together
// resolve in a quick stagger.
let batchAt = 0, batchIdx = 0;
const HOLD = 0.5;          // seconds the skeleton shows once in view
const STEP = 0.09;         // stagger between photos entering together

const loaded = (img) => new Promise((res) => {
  if (!img) return res();
  if (img.complete && img.naturalWidth) return res();
  img.addEventListener('load', res, { once: true });
  img.addEventListener('error', res, { once: true });
});
const holdTime = () => {
  const now = performance.now();
  if (now - batchAt > 260) batchIdx = 0;
  batchAt = now;
  return HOLD + Math.min(batchIdx++, 7) * STEP;
};

/** Photo inside a .media figure: skeleton → soft focus-in (WebGL or CSS). */
export function revealMedia(fig, { delay = 0, duration = 1.2, trigger = true } = {}) {
  fig.__r = fig.__r || { v: 0 };
  const img = fig.querySelector('img');
  const tween = gsap.to(fig.__r, {
    v: 1, duration, delay, ease: 'power2.out', paused: true,
    onStart: () => fig.classList.add('is-loaded'),
  });
  if (trigger) {
    onView(fig, async () => {
      const hold = holdTime();
      await Promise.all([loaded(img), new Promise((r) => setTimeout(r, hold * 1000))]);
      tween.play();
    }, 'top 96%');
  }
  return tween;
}

/** Any other photo wrapper marked .skel (gallery tiles, thumbnails). */
export function revealSkel(el, { wait = true } = {}) {
  const img = el.querySelector('img');
  if (!wait) { loaded(img).then(() => el.classList.add('is-loaded')); return; }
  onView(el, async () => {
    const hold = holdTime();
    await Promise.all([loaded(img), new Promise((r) => setTimeout(r, hold * 1000))]);
    el.classList.add('is-loaded');
  }, 'top 98%');
}

/** Standard reveals for anything inside root, run once per page mount */
export function setupReveals(root) {
  if (reducedMotion()) {
    qsa('.media', root).forEach((f) => { f.__r = { v: 1 }; f.classList.add('is-loaded'); });
    qsa('.skel', root).forEach((el) => revealSkel(el, { wait: false }));
    return;
  }

  // Headings: masked line rise
  qsa('[data-split]', root).forEach((el) => {
    const split = splitLines(el, el.dataset.split === 'chars' ? 'lines,chars' : 'lines');
    const targets = el.dataset.split === 'chars' ? split.chars : split.lines;
    const tw = gsap.from(targets, {
      yPercent: 110, duration: 1.4,
      stagger: el.dataset.split === 'chars' ? 0.025 : 0.09, ease: EASE,
      delay: +(el.dataset.delay || 0), paused: true,
    });
    onView(el, () => tw.play(), 'top 92%');
  });

  // Quiet fades for supporting text
  qsa('[data-fade]', root).forEach((el) => {
    const tw = gsap.from(el, { autoAlpha: 0, y: 24, duration: 1.2, ease: 'power3.out', delay: +(el.dataset.delay || 0), paused: true });
    onView(el, () => tw.play(), 'top 94%');
  });

  // Hairlines draw across
  qsa('[data-line]', root).forEach((el) => {
    const tw = gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut', paused: true });
    onView(el, () => tw.play(), 'top 96%');
  });

  // Images
  qsa('.media[data-reveal]', root).forEach((fig) => revealMedia(fig));
  qsa('.skel', root).forEach((el) => revealSkel(el));

  // Parallax drift
  qsa('[data-parallax]', root).forEach((el) => {
    const amt = parseFloat(el.dataset.parallax) || 10;
    gsap.fromTo(el, { yPercent: -amt / 2 }, {
      yPercent: amt / 2, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

export { gsap, ScrollTrigger, SplitText };
