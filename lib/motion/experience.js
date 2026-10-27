import Lenis from 'lenis';
import { gsap, ScrollTrigger, gate } from './anim';
import { GL } from './gl';
import { initCursor, magnetic } from './cursor';
import { initLightbox } from './lightbox';
import { routes } from './pages';
import { p, preloaderImages, seo } from '../content';
import { qs, qsa, esc, reducedMotion } from './utils';

let instance = null;

const clean = (path) => {
  const u = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return u === '' ? '/' : u;
};
const labelFor = (path) => (path === '/' ? 'Home' : (seo[path] && seo[path].title) || '');

export function start({ push, prefetch }) {
  if (instance) return instance;

  const rm = reducedMotion();
  const root = document.documentElement;
  const app = { lenis: null, gl: null, api: null, ctx: null, busy: false, current: null, refresh: () => ScrollTrigger.refresh() };

  // smooth scroll
  if (!rm) {
    app.lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, syncTouch: false });
    app.lenis.on('scroll', ScrollTrigger.update);
    app.lenis.stop();
  }

  // WebGL image layer
  app.gl = rm ? { ok: false } : new GL(qs('.gl'));
  root.classList.add(app.gl.ok ? 'has-gl' : 'no-gl');

  gsap.ticker.add((t) => {
    app.lenis && app.lenis.raf(t * 1000);
    app.gl.ok && app.gl.render(t, app.lenis ? app.lenis.velocity : 0);
  });
  gsap.ticker.lagSmoothing(0);

  const header = qs('.header');

  // theme
  const toggle = qs('.theme-toggle');
  const setTheme = (t) => {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('am-theme', t); } catch (e) {}
    toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  setTheme(root.getAttribute('data-theme') || 'light');
  let themeBusy = false;
  toggle.addEventListener('click', async () => {
    if (themeBusy) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (rm) return setTheme(next);
    themeBusy = true;
    const b = toggle.getBoundingClientRect();
    const x = b.left + b.width / 2, y = b.top + b.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    if (document.startViewTransition) {
      const vt = document.startViewTransition(() => setTheme(next));
      try {
        await vt.ready;
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 1100, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        );
        await vt.finished;
      } catch (e) {}
    } else {
      const wipe = document.createElement('div');
      wipe.className = 'theme-wipe';
      wipe.style.background = next === 'dark' ? '#13110E' : '#FAF6EF';
      document.body.appendChild(wipe);
      await gsap.fromTo(wipe, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 0.9, ease: 'expo.inOut' });
      setTheme(next);
      await gsap.to(wipe, { autoAlpha: 0, duration: 0.5 });
      wipe.remove();
    }
    themeBusy = false;
  });

  // header: solid after scrolling, tucks away on the way down
  let lastY = 0;
  const onScroll = (y) => {
    header.classList.toggle('is-solid', y > 40);
    if (!root.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > 240 && y > lastY);
    lastY = y;
  };
  app.lenis ? app.lenis.on('scroll', (l) => onScroll(l.scroll)) : window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

  // mobile menu
  const menu = qs('.menu');
  const burger = qs('.burger');
  const toggleMenu = (open = !root.classList.contains('menu-open')) => {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', !open);
    header.classList.remove('is-hidden');
    if (open) {
      app.lenis && app.lenis.stop();
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: rm ? 0 : 0.9, ease: 'expo.inOut' });
      gsap.fromTo(qsa('.menu__nav a', menu), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.05, ease: 'expo.out', delay: rm ? 0 : 0.35 });
    } else {
      app.lenis && app.lenis.start();
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: rm ? 0 : 0.8, ease: 'expo.inOut', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
  };
  burger.addEventListener('click', () => toggleMenu());

  // pages
  const setActive = (path) => {
    qsa('.nav a, .menu__nav a').forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === path));
    qsa('.nav a').forEach((a) => (a.getAttribute('href') === path ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  };

  let unMagnet = () => {};
  const teardown = () => {
    app.api && app.api.destroy && app.api.destroy();
    app.api = null;
    app.ctx && app.ctx.revert();
    app.ctx = null;
    unMagnet();
    app.gl.ok && app.gl.clear();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };

  const mount = (path) => {
    const main = qs('#app');
    setActive(path);
    app.current = path;
    app.lenis ? app.lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0);
    const fn = routes[path] || routes['/fashion'];
    app.ctx = gsap.context(() => { app.api = fn(main, app); }, main);
    app.gl.ok && app.gl.scan(main);
    unMagnet = magnetic(document);
    qsa('img', main).forEach((im) => !im.complete && im.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }));
    ScrollTrigger.refresh();
  };

  // wait until React has rendered the new route
  const pageReady = (path) => new Promise((resolve) => {
    const t0 = performance.now();
    const check = () => {
      const el = qs(`#app [data-route="${path}"]`) || (!seo[path] && qs('#app [data-route]')) || (performance.now() - t0 > 4000 && qs('#app > *'));
      el ? resolve() : requestAnimationFrame(check);
    };
    check();
  });

  const curtain = qs('.curtain');
  const curtainLabel = qs('.curtain__label em');
  const bars = qsa('.curtain__bars i', curtain);
  const line = qs('.curtain__line i', curtain);
  const lightbox = initLightbox(app);
  const splitLabel = (text) => {
    curtainLabel.innerHTML = [...text].map((ch) => `<span style="display:inline-block">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
    return qsa('span', curtainLabel);
  };

  let expected = null;
  let arrived = null;

  async function navigate(path) {
    if (app.busy) return;
    if (path === app.current) { root.classList.contains('menu-open') && toggleMenu(false); return; }
    app.busy = true;
    const menuWasOpen = root.classList.contains('menu-open');
    lightbox.close();
    const main = qs('#app');

    if (!rm) {
      gate.close();
      app.lenis && app.lenis.stop();
      const chars = splitLabel(labelFor(path));
      gsap.set(curtain, { visibility: 'visible' });
      await gsap.timeline()
        .set(bars, { scaleY: 0, transformOrigin: '50% 100%' })
        .set(chars, { yPercent: 110 })
        .set(line, { scaleX: 0, transformOrigin: '0% 50%' })
        .to(main, { y: -70, duration: 0.9, ease: 'expo.inOut' }, 0)
        .to(bars, { scaleY: 1, duration: 0.75, ease: 'expo.inOut', stagger: { each: 0.06, from: 'center' } }, 0)
        .to(chars, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.025 }, 0.45)
        .to(line, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, 0.5);
    }

    if (menuWasOpen) {
      root.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
      gsap.set(menu, { visibility: 'hidden', clipPath: 'inset(0 0 100% 0)' });
    }
    teardown();
    gsap.set(main, { clearProps: 'transform' });

    expected = path;
    const routed = new Promise((r) => { arrived = r; setTimeout(r, 6000); });
    push(path);
    await routed;
    await pageReady(path);
    mount(path);
    header.classList.remove('is-hidden');

    if (!rm) {
      const chars = qsa('span', curtainLabel);
      await gsap.timeline()
        .to(chars, { yPercent: -110, duration: 0.55, ease: 'expo.in', stagger: 0.015 }, 0)
        .to(line, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.5, ease: 'power2.in' }, 0)
        .to(bars, { scaleY: 0, transformOrigin: '50% 0%', duration: 0.8, ease: 'expo.inOut', stagger: { each: 0.06, from: 'edges' } }, 0.3)
        .add(() => gate.open(), 0.55);
      gsap.set(curtain, { visibility: 'hidden' });
      app.lenis && app.lenis.start();
    } else {
      gate.open();
    }
    app.busy = false;
    main.focus({ preventScroll: true });
  }

  // internal links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    e.preventDefault();
    navigate(clean(a.getAttribute('href')));
  });
  const prefetched = new Set();
  document.addEventListener('pointerover', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    const path = clean(a.getAttribute('href'));
    if (!prefetched.has(path)) { prefetched.add(path); prefetch(path); }
  }, { passive: true });

  // intro loader (first visit in a session only)
  async function intro() {
    const pre = qs('.preloader');
    const skip = root.getAttribute('data-intro') === 'skip';
    try { sessionStorage.setItem('am-intro', '1'); } catch (e) {}
    if (skip || rm) { pre.classList.add('is-done'); return; }

    const stack = qs('.preloader__stack', pre);
    const num = qs('.preloader__num', pre);
    const imgs = preloaderImages.map((k) => { const im = new Image(); im.src = p(k).s; im.alt = ''; stack.appendChild(im); return im; });
    const loaded = Promise.all([document.fonts.ready, ...imgs.map((im) => im.decode().catch(() => {}))]);

    const count = { v: 0 };
    const tl = gsap.timeline();
    tl.from(qsa('.preloader__name span > *, .preloader__name span', pre), { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0)
      .to(count, { v: 86, duration: 1.7, ease: 'power2.inOut', onUpdate: () => (num.textContent = Math.round(count.v)) }, 0);
    imgs.forEach((im, i) => tl.to(im, { clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'expo.inOut' }, 0.15 + i * 0.24));
    await Promise.all([tl, loaded]);
    await gsap.to(count, { v: 100, duration: 0.4, ease: 'power2.out', onUpdate: () => (num.textContent = Math.round(count.v)) });

    await gsap.timeline()
      .to(qsa('.preloader__name span', pre), { yPercent: -110, duration: 0.8, ease: 'expo.in', stagger: 0.05 }, 0)
      .to([num, qs('.preloader__meta', pre)], { autoAlpha: 0, duration: 0.4 }, 0)
      .to(stack, { scale: 1.15, duration: 1.2, ease: 'expo.inOut' }, 0.1)
      .to(pre, { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, 0.55)
      .add(() => gate.open(), 0.95);
    pre.classList.add('is-done');
  }

  // boot
  gate.close();
  initCursor();
  let booted = false;

  instance = {
    routeChanged(pathname) {
      const path = clean(pathname);
      if (!booted) {
        booted = true;
        pageReady(path).then(() => {
          mount(path);
          intro().then(() => {
            document.body.classList.remove('is-loading');
            gate.open();
            app.lenis && app.lenis.start();
            ScrollTrigger.refresh();
          });
        });
        return;
      }
      if (expected === path && arrived) { arrived(); arrived = null; expected = null; return; }
      // browser back / forward
      if (path !== app.current && !app.busy) {
        lightbox.close();
        teardown();
        pageReady(path).then(() => { mount(path); gate.open(); });
      }
    },
  };
  return instance;
}
