import { fashion } from '@/lib/content';
import { pageMetadata, webPageSchema, breadcrumbSchema, imageObject } from '@/lib/seo';
import Media from '@/components/Media';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/fashion');

const sizesFor = (layout, i) =>
  layout === 'feature' && i === 0
    ? '(max-width: 860px) 92vw, 40vw'
    : layout === 'grid2'
      ? '(max-width: 860px) 46vw, 46vw'
      : '(max-width: 860px) 46vw, 30vw';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function FashionPage() {
  const schema = webPageSchema('/fashion', 'CollectionPage', {
    hasPart: fashion.projects.map((pr) => ({
      '@type': 'CreativeWork',
      name: pr.title,
      description: pr.description,
      url: `https://aureliomilan.com/fashion#${slug(pr.title)}`,
      image: pr.images.slice(0, 3).map((im) => imageObject(im.key, `Aurelio Milan — ${pr.title}: ${im.alt}`)),
    })),
  });

  return (
    <div className="wrap" data-route="/fashion">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema('/fashion')} />
      <section className="intro">
        <p className="eyebrow" data-fade="">Fashion work</p>
        <h1 className="h-page" data-split="">
          Projects, fashion weeks
          <br />
          <em>&amp; events.</em>
        </h1>
        <p className="lead" data-fade="" data-delay="0.3">{fashion.sub}</p>
      </section>

      {fashion.projects.map((pr, i) => (
        <section className="project" id={slug(pr.title)} aria-labelledby={`${slug(pr.title)}-title`} key={pr.title}>
          <header className="project__head">
            <span className="project__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h2 id={`${slug(pr.title)}-title`} className="project__title" data-split="">{pr.title}</h2>
            <div className="project__meta">
              {pr.meta.map((m) => (
                <span className="meta" data-fade="" key={m}>{m}</span>
              ))}
            </div>
          </header>
          <div className={`pgrid pgrid--${pr.layout}`}>
            {pr.images.map((im, j) => (
              <Media key={im.key} photo={im.key} alt={`Aurelio Milan — ${pr.title}: ${im.alt}`} sizes={sizesFor(pr.layout, j)} />
            ))}
          </div>
          <div className="project__body">
            <p data-fade="">{pr.description}</p>
            {pr.quote && (
              <div className="words" data-fade="">
                <span className="eyebrow">In his words</span>
                <p>“{pr.quote}”</p>
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="next" aria-labelledby="next-title">
        <h2 id="next-title" className="project__title" data-split="">{fashion.next.title}</h2>
        <p className="next__box" data-fade="">{fashion.next.note}</p>
      </section>
    </div>
  );
}
