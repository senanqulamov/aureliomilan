import { gallery, map } from '../content';
import { esc, qs, qsa, imgAttrs, reducedMotion } from './utils';
import { gsap, onView } from './anim';

const labelFor = (key) => (gallery.items.find((g) => g.key === key) || {}).label || '';

export function mountMap(root) {
  const rm = reducedMotion();
    // Map
    const panel = qs('.map__panel', root);
    const pills = qsa('.map__pill', root);
    const groups = qsa('.map__place', root);
    const select = (id, animate = true) => {
      const pl = map.places.find((x) => x.id === id);
      pills.forEach((b) => { b.classList.toggle('is-active', b.dataset.id === id); b.setAttribute('aria-pressed', b.dataset.id === id); });
      groups.forEach((g) => g.classList.toggle('is-active', g.dataset.id === id));
      const photos = pl.keys.map((key) => ({ key, label: `${pl.city} · ${labelFor(key) || pl.year}` }));
      panel.innerHTML = `
        <div class="map__panel-head">
          <h3>${esc(pl.city)}, <em>${esc(pl.country)}</em></h3>
          <span class="meta">${esc(pl.title)} · ${esc(pl.year)}</span>
        </div>
        ${photos.length ? `<div class="map__thumbs">${photos.map((ph, i) => `
          <button class="map__thumb skel" data-label="${esc(ph.label)}" aria-label="Open photo ${i + 1} from ${esc(pl.city)}"><img ${imgAttrs(ph.key, { sizes: '200px' })} alt=""></button>`).join('')}</div>`
          : `<div class="map__empty">${pl.upcoming ? 'Upcoming — photos will appear here once the work is published.' : 'Photos for this place will appear here.'}</div>`}`;
      qsa('.map__thumb', panel).forEach((t, i) => setTimeout(() => {
        const im = t.querySelector('img');
        const done = () => t.classList.add('is-loaded');
        if (im.complete && im.naturalWidth) done(); else { im.addEventListener('load', done, { once: true }); im.addEventListener('error', done, { once: true }); }
      }, rm ? 0 : 350 + i * 70));
      if (animate && !rm) gsap.from(qsa('.map__panel-head, .map__thumb, .map__empty', panel), { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.04, ease: 'expo.out' });
    };
    pills.forEach((b) => b.addEventListener('click', () => select(b.dataset.id)));
    groups.forEach((g) => g.addEventListener('click', () => select(g.dataset.id)));
    select(map.places[0].id, false);
    // phones: the map scrolls sideways — start centred
    const frame = qs('.map__frame', root);
    requestAnimationFrame(() => { frame.scrollLeft = (frame.scrollWidth - frame.clientWidth) / 2; });

    // map entrance: land fades in, pins pop, lines draw, labels slide in
    if (!rm) {
      const svg = qs('.map__svg', root);
      const leads = qsa('.map__lead', root);
      const lens = leads.map((l) => Math.hypot(l.x2.baseVal.value - l.x1.baseVal.value, l.y2.baseVal.value - l.y1.baseVal.value));
      gsap.set(qsa('.map__land, .map__hi, .map__borders', svg), { autoAlpha: 0 });
      gsap.set(qsa('.map__dot', svg), { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(qsa('.map__pulse', svg), { autoAlpha: 0 });
      leads.forEach((l, i) => gsap.set(l, { attr: { 'stroke-dasharray': `${lens[i]}`, 'stroke-dashoffset': lens[i] } }));
      gsap.set(pills, { autoAlpha: 0, y: 16 });
      onView(svg, () => {
        const tl = gsap.timeline()
          .to(qsa('.map__land, .map__hi, .map__borders', svg), { autoAlpha: 1, duration: 1.4, stagger: 0.15, ease: 'power2.out' })
          .to(qsa('.map__dot', svg), { scale: 1, duration: 0.9, stagger: 0.15, ease: 'back.out(3)' }, 0.5)
          .to(qsa('.map__pulse', svg), { autoAlpha: 1, duration: 0.6, stagger: 0.15 }, 0.6)
          .to(pills, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'expo.out' }, 1.2);
        leads.forEach((l, i) => tl.to(l, { attr: { 'stroke-dashoffset': 0 }, duration: 1, ease: 'expo.inOut', onComplete: () => l.setAttribute('stroke-dasharray', '3 5') }, 0.8 + i * 0.15));
      }, 'top 75%');
    }

}
