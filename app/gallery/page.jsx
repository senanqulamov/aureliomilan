import { gallery } from '@/lib/content';
import { pageMetadata, webPageSchema, breadcrumbSchema, imageObject } from '@/lib/seo';
import { imgProps } from '@/components/Media';
import MapSection from '@/components/MapSection';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/gallery');

const altFor = (g) => `Aurelio Milan — ${g.label} photograph`;

export default function GalleryPage() {
  const count = (id) => (id === 'all' ? gallery.items.length : gallery.items.filter((g) => g.category === id).length);
  const schema = webPageSchema('/gallery', 'ImageGallery', {
    image: gallery.items.map((g) => imageObject(g.key, altFor(g))),
  });

  return (
    <div data-route="/gallery">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema('/gallery')} />
      <div className="wrap">
        <section className="intro">
          <div className="intro__row">
            <div>
              <p className="eyebrow" data-fade="">Gallery</p>
              <h1 className="h-page" data-split="">
                The full
                <br />
                <em>picture.</em>
              </h1>
            </div>
            <div className="filters" role="group" aria-label="Filter photos" data-fade="">
              {gallery.filters.map((f, i) => (
                <button key={f.id} type="button" className={`filter${i === 0 ? ' is-active' : ''}`} data-filter={f.id} aria-pressed={i === 0}>
                  {f.label}
                  <sup>{count(f.id)}</sup>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="masonry wrap" aria-label="Photos">
        {gallery.items.map((g, i) => (
          <button type="button" className="gitem skel" data-cat={g.category} data-i={i} aria-label={`Open photo: ${g.label}`} key={g.key}>
            <span className="gitem__img">
              <img {...imgProps(g.key, { sizes: '(max-width: 1024px) 46vw, 30vw' })} alt={altFor(g)} />
            </span>
            <span className="gitem__label">{g.label}</span>
          </button>
        ))}
      </section>
      <MapSection />
    </div>
  );
}
