import { gsap, ScrollTrigger, SplitText, setupReveals, revealMedia, onView, gate, EASE } from './anim';
import { Flip } from 'gsap/Flip';
import { mountMap } from './map';
import { contact as contactCopy, site } from '../content';
import { qs, qsa, isTouch, reducedMotion } from './utils';

gsap.registerPlugin(Flip);

// Client-side behaviour for each route. Each function receives the page root
// (already rendered by React) and returns { destroy }.

function home(root, app) {
  const offs = [];
  const rm = reducedMotion();

  // Hero entrance (plays when the gate opens)
  const title = qs('.hero__title', root);
  const fig = qs('.hero__media', root);
  const heroFades = qsa('[data-hero="fade"]', root);
  const stats = qsa('.stat', root);
  if (!rm) {
    const split = SplitText.create(qsa('.hero__title > span', root), { type: 'chars', mask: 'chars', charsClass: 'char' });
    gsap.set(split.chars, { yPercent: 115 });
    gsap.set([...heroFades, ...stats], { autoAlpha: 0, y: 20 });
    const tween = revealMedia(fig, { trigger: false, duration: 1.9 });
    gate.p.then(() => {
      const tl = gsap.timeline();
      tl.add(tween.play(), 0)
        .to(split.chars, { yPercent: 0, duration: 1.6, stagger: 0.045, ease: EASE }, 0.15)
        .to(heroFades, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out' }, 0.7)
        .to(stats, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, ease: 'power3.out' }, 0.9);
    });

    // Scroll: name splits apart, portrait zooms gently
    const st = { trigger: root.querySelector('.hero'), start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(qs('.l1', title), { xPercent: -14, ease: 'none', scrollTrigger: st });
    gsap.to(qs('.l2', title), { xPercent: 10, ease: 'none', scrollTrigger: st });
    const z = { v: 0 };
    gsap.to(z, { v: 0.12, ease: 'none', scrollTrigger: st, onUpdate: () => (fig.__zoom = z.v) });
    gsap.to(qs('.hero__portrait', root), { yPercent: 12, ease: 'none', scrollTrigger: st });
  }

  setupReveals(root);
  mountMap(root);
  if (rm) return { destroy() {} };

  // Statement: words light up as you scroll
  const stText = qs('.statement__text', root);
  const words = SplitText.create(stText, { type: 'words', wordsClass: 'word' }).words;
  gsap.to(words, {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: stText, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });

  // Cannes: pinned horizontal scroll on desktop
  const mm = gsap.matchMedia();
  const section = qs('.cannes', root);
  const track = qs('.cannes__track', root);
  const hfigs = qsa('[data-hreveal]', root);
  hfigs.forEach((f) => (f.__r = { v: 0 }));
  const revealH = (f) => setTimeout(() => {
    f.classList.add('is-loaded');
    gsap.to(f.__r, { v: 1, duration: 1.2, ease: 'power2.out' });
  }, 450);

  mm.add('(min-width: 861px)', () => {
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: section, pin: qs('.cannes__pin', root), start: 'top top', end: () => '+=' + dist(),
        scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(qs('.cannes__progress i', root), { scaleX: self.progress }),
      },
    });
    hfigs.forEach((f) => ScrollTrigger.create({ trigger: f, containerAnimation: tween, start: 'left 95%', once: true, onEnter: () => revealH(f) }));
    // the year outline drifts at its own pace
    gsap.fromTo(qs('.cannes__outro', root), { xPercent: 40 }, { xPercent: -10, ease: 'none', scrollTrigger: { trigger: qs('.cannes__outro', root), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
  });
  mm.add('(max-width: 860px)', () => {
    hfigs.forEach((f) => onView(f.closest('.cannes'), () => revealH(f), 'top 70%'));
  });

  // Marquee: loops, speeds up and flips with scroll
  const inner = qs('.marquee__inner', root);
  const loop = gsap.to(inner, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
  const onScroll = ({ velocity, direction }) => {
    const speed = 1 + Math.min(Math.abs(velocity) / 6, 5);
    gsap.to(loop, { timeScale: speed * (direction < 0 ? -1 : 1), duration: 0.4, overwrite: true });
  };
  app.lenis && app.lenis.on('scroll', onScroll);
  offs.push(() => app.lenis && app.lenis.off('scroll', onScroll));

  // Selected work: floating preview follows the cursor
  if (!isTouch()) {
    const float = qs('.work__float', root);
    const imgs = qsa('img', float);
    const xTo = gsap.quickTo(float, 'x', { duration: 0.7, ease: 'power3' });
    const yTo = gsap.quickTo(float, 'y', { duration: 0.7, ease: 'power3' });
    const rot = gsap.quickTo(float, 'rotate', { duration: 0.9, ease: 'power3' });
    let lastX = 0;
    const move = (e) => {
      const w = float.offsetWidth, h = float.offsetHeight;
      xTo(e.clientX - w / 2); yTo(e.clientY - h / 2);
      rot(Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.6))); lastX = e.clientX;
    };
    qsa('.work__row', root).forEach((row) => {
      row.addEventListener('pointerenter', (e) => {
        imgs.forEach((im, i) => im.classList.toggle('is-on', i === +row.dataset.i));
        float.classList.add('is-on'); move(e);
      });
      row.addEventListener('pointermove', move);
      row.addEventListener('pointerleave', () => float.classList.remove('is-on'));
    });
    // row titles slide in from the mask
    qsa('.work__row', root).forEach((row, i) => {
      const tw = gsap.from(row, { autoAlpha: 0, y: 40, duration: 1.2, delay: i * 0.08, ease: 'power3.out', paused: true });
      onView(row, () => tw.play(), 'top 95%');
    });
  }

  return { destroy: () => { offs.forEach((f) => f()); mm.revert(); } };
}

function about(root, app) {
  setupReveals(root);
  if (reducedMotion()) return { destroy() {} };
  // The name runs down the strip on its own, and faster while the page scrolls
  const track = qs('.vstrip__track', root);
  const loop = gsap.to(track, { yPercent: -50, duration: 26, ease: 'none', repeat: -1 });
  const onScroll = ({ velocity }) => {
    gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(velocity) / 4, 6), duration: 0.3, overwrite: true });
    gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3 });
  };
  app.lenis && app.lenis.on('scroll', onScroll);
  gsap.from(qs('.vstrip', root), { scaleY: 0, transformOrigin: 'top', duration: 1.6, ease: 'expo.inOut', delay: 0.2 });
  return { destroy() { app.lenis && app.lenis.off('scroll', onScroll); } };
}

function gallery(root, app) {
  setupReveals(root);
  const rm = reducedMotion();
  const grid = qs('.masonry', root);
  const items = qsa('.gitem', root);
  let colTweens = [];
  const nCols = () => (window.innerWidth <= 1024 ? 2 : 3);

  // Columns: distribute photos into the shortest column
  const ratio = (it) => { const im = qs('img', it); return (+im.getAttribute('height') || 4) / (+im.getAttribute('width') || 3); };
  const layout = () => {
    const n = nCols();
    colTweens.forEach((t) => { t.scrollTrigger && t.scrollTrigger.kill(); t.kill(); });
    colTweens = [];
    const cols = Array.from({ length: n }, (_, i) => { const c = document.createElement('div'); c.className = 'mcol'; c.dataset.col = i; return c; });
    const h = new Array(n).fill(0);
    items.filter((it) => !it.classList.contains('is-hidden')).forEach((it) => {
      const k = h.indexOf(Math.min(...h));
      cols[k].appendChild(it); h[k] += ratio(it);
    });
    items.filter((it) => it.classList.contains('is-hidden')).forEach((it) => cols[0].appendChild(it));
    qsa('.mcol', grid).forEach((c) => c.remove());
    cols.forEach((c) => grid.appendChild(c));
    if (rm) return;
    // Columns drift at different speeds while scrolling: the middle (or right) column runs against the others
    const travel = Math.min(window.innerHeight * 0.7, 640);
    // per column: [start, end] as a share of travel — middle runs against the outer ones
    const paths = n === 3 ? [[-0.2, 0.75], [0.25, -1.1], [-0.05, 0.9]] : [[-0.2, 0.75], [0.25, -1.1]];
    cols.forEach((c, i) => {
      const [a, b] = paths[i];
      colTweens.push(gsap.fromTo(c, { y: a * travel }, {
        y: b * travel, ease: 'none',
        scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: 0.35 },
      }));
    });
  };
  layout();
  let lastN = nCols();
  const onResize = () => { const n = nCols(); if (n !== lastN) { lastN = n; layout(); ScrollTrigger.refresh(); } };
  window.addEventListener('resize', onResize);

  if (!rm) {
    // each photo drifts inside its frame while scrolling
    items.forEach((it) => {
      const img = qs('img', it);
      gsap.fromTo(img, { yPercent: -12, scale: 1.28 }, {
        yPercent: 12, scale: 1.08, ease: 'none',
        scrollTrigger: { trigger: it, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  // Filters
  const btns = qsa('.filter', root);
  btns.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    btns.forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', x === b); });
    const state = Flip.getState(items);
    items.forEach((it) => { it.classList.toggle('is-hidden', !(f === 'all' || it.dataset.cat === f)); });
    layout();
    if (rm) { ScrollTrigger.refresh(); return; }
    Flip.from(state, {
      duration: 0.9, ease: 'expo.inOut', absolute: true, stagger: 0.012,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.5 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }));

  mountMap(root);

  return { destroy: () => { window.removeEventListener('resize', onResize); } };
}

function contact(root) {
  setupReveals(root);
  const form = qs('.contact__form', root);
  const status = qs('.form-status', form);
  const err = (k, msg) => (qs(`[data-err="${k}"]`, form).textContent = msg);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    let ok = true;
    err('name', ''); err('email', ''); err('message', '');
    if (!d.name.trim()) { err('name', 'Add your name or brand.'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) { err('email', 'Enter a valid email address.'); ok = false; }
    if (!d.message.trim()) { err('message', 'Tell Aurelio about the project.'); ok = false; }
    if (!ok) return;

    status.classList.remove('is-ok');
    if (site.formEndpoint) {
      status.textContent = 'Sending…';
      try {
        const r = await fetch(site.formEndpoint, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        if (!r.ok) throw new Error();
        form.reset();
        status.textContent = 'Inquiry sent. Aurelio will reply by email.';
        status.classList.add('is-ok');
      } catch {
        status.textContent = `The inquiry didn't send. Email ${site.email} directly instead.`;
      }
      return;
    }
    // Fallback: open the visitor's mail app
    const body = `Name / brand: ${d.name}\nEmail: ${d.email}\n\n${d.message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(contactCopy.subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email app opened with the inquiry filled in.';
    status.classList.add('is-ok');
  });
  return { destroy() {} };
}

function basic(root) {
  setupReveals(root);
  return { destroy() {} };
}

export const routes = {
  '/': home,
  '/about': about,
  '/gallery': gallery,
  '/contact': contact,
  '/fashion': basic,
  '/press': basic,
  '/blog': basic,
};
