import { press, site } from '@/lib/content';
import { pageMetadata, webPageSchema, breadcrumbSchema, abs } from '@/lib/seo';
import Media from '@/components/Media';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/press');

export default function PressPage() {
  const schema = webPageSchema('/press', 'CollectionPage', {
    mentions: press.events.map((ev) => ({
      '@type': 'Event',
      name: ev.title,
      startDate: ev.date,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@type': 'Place', name: 'Palais des Festivals', address: { '@type': 'PostalAddress', addressLocality: 'Cannes', addressCountry: 'FR' } },
      attendee: { '@id': abs('/#person') },
    })),
  });

  return (
    <div className="wrap" data-route="/press">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema('/press')} />
      <section className="intro">
        <p className="eyebrow" data-fade="">Press &amp; events</p>
        <h1 className="h-page" data-split="">
          Featured in
          <br />
          <em>30+ publications.</em>
        </h1>
        <p className="lead" data-fade="" data-delay="0.3">{press.sub}</p>
      </section>

      <section className="press">
        <div className="press__col">
          <h2 className="eyebrow" data-fade="">In the press</h2>
          {press.items.length > 0 ? (
            <div className="press__list">
              {press.items.map((it) => (
                <a className="prow" href={it.url} target="_blank" rel="noopener noreferrer" data-fade="" key={it.url}>
                  <div>
                    <div className="prow__pub">{it.publication}</div>
                    <div className="meta">{it.title} · {it.date}</div>
                  </div>
                  <span className="prow__arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="press__kit" data-fade="">
              <p>{press.emptyNote}</p>
              <a className="btn btn--outline" href={`mailto:${site.email}?subject=${encodeURIComponent('Press kit request — Aurelio Milan')}`} data-magnetic="0.2">
                Request the press kit
              </a>
            </div>
          )}
        </div>
        <div className="press__col">
          <h2 className="eyebrow" data-fade="">Events &amp; appearances</h2>
          {press.events.map((ev) => (
            <article className="event" key={ev.title}>
              <Media photo={ev.key} alt={`Aurelio Milan at the ${ev.title}`} sizes="(max-width: 860px) 92vw, 34vw" />
              <h3 data-fade="">{ev.title}</h3>
              <p className="meta" data-fade="">{ev.meta}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
