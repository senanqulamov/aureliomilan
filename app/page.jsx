import { preload } from 'react-dom';
import { home, site, p } from '@/lib/content';
import { pageMetadata, webPageSchema, imageObject } from '@/lib/seo';
import Media, { imgProps } from '@/components/Media';
import MapSection from '@/components/MapSection';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/');

export default function HomePage() {
  const hero = p(home.heroImage);
  preload(hero.s, { as: 'image', imageSrcSet: `${hero.s} 800w, ${hero.l} 1600w`, imageSizes: '(max-width: 860px) 76vw, 34vw', fetchPriority: 'high' });
  const c = home.cannes;
  const schema = webPageSchema('/', 'WebPage', {
    primaryImageOfPage: imageObject(home.heroImage, 'Aurelio Milan on the red carpet at the Cannes Film Festival 2026'),
  });

  return (
    <div data-route="/">
      <JsonLd data={schema} />

      <section className="hero" aria-label="Introduction">
        <p className="hero__eyebrow eyebrow" data-hero="fade">{site.tagline}</p>
        <h1 className="hero__title">
          <span className="l1">Aurelio</span> <span className="l2">Milan</span>
        </h1>
        <div className="hero__portrait">
          <Media
            photo={home.heroImage}
            alt="Aurelio Milan in a white tuxedo on the red carpet at the Cannes Film Festival 2026"
            className="hero__media"
            reveal={false}
            eager
            sizes="(max-width: 860px) 76vw, 34vw"
            cursor="Cannes"
          />
          <div className="hero__tag" data-hero="fade">{home.heroLabel}</div>
        </div>
        <div className="hero__bottom">
          <p className="lead" data-hero="fade">{home.intro}</p>
          <div className="hero__ctas" data-hero="fade">
            <a className="btn btn--primary" href="/fashion" data-link="" data-magnetic="0.2">View fashion work</a>
            <a className="btn btn--outline" href={site.instagram} target="_blank" rel="noopener noreferrer" data-magnetic="0.2">Instagram ↗</a>
          </div>
        </div>
        <dl className="hero__stats">
          {home.stats.map((s) => (
            <div className="stat" key={s.label}>
              <dt className="stat__l meta">{s.label}</dt>
              <dd className="stat__v">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="hero__scroll meta" aria-hidden="true" data-hero="fade">Scroll <i /></div>
      </section>

      <section className="statement wrap" aria-label="Background">
        <div className="statement__inner">
          <p className="statement__label eyebrow">From the pitch</p>
          <p className="statement__text">{home.statement}</p>
        </div>
      </section>

      <section className="cannes" aria-labelledby="cannes-title">
        <div className="cannes__pin">
          <div className="cannes__track">
            <div className="cannes__intro">
              <h2 id="cannes-title" className="cannes__title" data-split="">
                Cannes<br />Film Festival
              </h2>
              <span className="cannes__tag" data-fade="">Red carpet · {c.year}</span>
              <p data-fade="">{c.caption}</p>
              <a href="/fashion" data-link="" className="link-line" data-fade="">See the full story →</a>
            </div>
            {c.images.map((im) => (
              <div className="cannes__item" key={im.key}>
                <Media
                  photo={im.key}
                  alt={`Aurelio Milan at the Cannes Film Festival ${c.year} — ${im.cap}`}
                  reveal={false}
                  sizes="(max-width: 860px) 70vw, 30vw"
                  data-hreveal=""
                />
                <div className="cannes__cap">
                  <span>{im.cap}</span>
                  <span className="meta">Cannes {c.year}</span>
                </div>
              </div>
            ))}
            <div className="cannes__outro" aria-hidden="true">{c.year}</div>
          </div>
        </div>
        <div className="cannes__progress" aria-hidden="true"><i /></div>
      </section>

      {home.showQuote && (
        <section className="quote wrap" aria-label="Philosophy">
          <p className="eyebrow" data-fade="">His philosophy</p>
          <blockquote data-split="">“{home.quote}”</blockquote>
          <cite className="meta" data-fade="">— Aurelio Milan</cite>
        </section>
      )}

      <div className="marquee" aria-hidden="true">
        <div className="marquee__inner">
          {[0, 1].map((i) => (
            <span key={i}>
              Model <em>—</em> Athlete <em>—</em> Entrepreneur <em>—</em> Baku <em>—</em> Milano <em>—</em>{' '}
            </span>
          ))}
        </div>
      </div>

      <section className="work wrap" aria-labelledby="work-title">
        <div className="work__head">
          <h2 id="work-title" className="h-sec" data-split="">Selected work</h2>
          <a href="/gallery" data-link="" className="link-line" data-fade="">Full gallery →</a>
        </div>
        <div className="work__list" data-line="" />
        <div className="work__rows">
          {home.selected.map((w, i) => (
            <a className="work__row" href="/fashion" data-link="" data-i={i} data-cursor="View" key={w.title}>
              <div className="work__thumb skel">
                <img {...imgProps(w.key, { sizes: '100px' })} alt="" />
              </div>
              <h3>{w.title}</h3>
              <span className="meta">{w.meta}</span>
              <span className="meta year">{w.year}</span>
            </a>
          ))}
        </div>
        <div className="work__float" aria-hidden="true">
          {home.selected.map((w) => (
            <img key={w.key} {...imgProps(w.key, { sizes: '320px' })} alt="" />
          ))}
        </div>
      </section>

      <MapSection />

      <section className="cta dark" aria-labelledby="cta-title">
        <div className="wrap">
          <p className="eyebrow" style={{ color: 'var(--gold)' }} data-fade="">Campaigns · Editorials · Runway</p>
          <h2 id="cta-title" className="cta__title" data-split="chars" style={{ marginTop: 28 }}>
            Work with <em>Aurelio.</em>
          </h2>
          <p data-fade="">For campaigns, editorials, runway and brand partnerships — reach out directly or through Instagram.</p>
          <a href="/contact" data-link="" className="btn btn--light cta__btn" data-magnetic="0.45" data-fade="">Book Aurelio</a>
        </div>
      </section>
    </div>
  );
}
