import { about } from '@/lib/content';
import { pageMetadata, webPageSchema, breadcrumbSchema, personSchema } from '@/lib/seo';
import Media from '@/components/Media';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/about');

const numerals = ['i', 'ii', 'iii', 'iv', 'v'];

export default function AboutPage() {
  const schema = webPageSchema('/about', 'ProfilePage', { mainEntity: personSchema() });
  return (
    <div className="wrap" data-route="/about">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema('/about')} />
      <section className="about">
        <aside className="about__aside">
          <div className="about__sticky">
            <div className="about__visual">
              <Media
                photo={about.portrait}
                alt="Aurelio Milan in a pinstripe suit, studio portrait"
                className="about__portrait"
                eager
                sizes="(max-width: 860px) 75vw, 32vw"
              />
              <div className="vstrip" aria-hidden="true">
                <div className="vstrip__track">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i}>
                      Aurelio <em>Milan</em>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="profile" data-fade="">
              <h2 className="eyebrow">Profile</h2>
              <dl>
                {about.profile.map(([k, v]) => (
                  <div key={k} style={{ display: 'contents' }}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
        <div className="about__main">
          <p className="eyebrow" data-fade="">About Aurelio Milan</p>
          <h1 className="h-page" data-split="">
            {about.title[0]}
            <br />
            <em>{about.title[1]}</em>
          </h1>
          {about.sections.map((s, i) => (
            <article className="about__sec" key={s.title}>
              <span className="num" data-fade="" aria-hidden="true">{numerals[i]}.</span>
              <h2 data-split="">{s.title}</h2>
              <div className="prose" data-fade="">
                {s.body.map((b) => (
                  <p key={b.slice(0, 24)}>{b}</p>
                ))}
              </div>
            </article>
          ))}
          <div className="about__pair">
            {about.closing.map((c) => (
              <Media key={c.key} photo={c.key} alt={`Aurelio Milan — ${c.alt.toLowerCase()} editorial`} sizes="(max-width: 860px) 46vw, 24vw" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
