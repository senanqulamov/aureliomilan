import { contact, site } from '@/lib/content';
import { pageMetadata, webPageSchema, breadcrumbSchema, abs } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/contact');

export default function ContactPage() {
  const schema = webPageSchema('/contact', 'ContactPage', {
    mainEntity: {
      '@id': abs('/#person'),
      '@type': 'Person',
      name: site.name,
      contactPoint: { '@type': 'ContactPoint', contactType: 'booking', email: site.email, availableLanguage: ['English', 'Turkish', 'Azerbaijani'] },
    },
  });

  return (
    <div className="wrap" data-route="/contact">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema('/contact')} />
      <section className="contact">
        <div className="contact__left">
          <p className="eyebrow" data-fade="">Contact &amp; booking</p>
          <h1 className="h-page" data-split="">
            {contact.title[0]}
            <br />
            <em>{contact.title[1]}</em>
          </h1>
          <p className="lead" data-fade="">{contact.sub}</p>
          <div className="clinks" data-fade="">
            <a className="clink" href={`mailto:${site.email}`}>
              <div>
                <div className="meta">Email</div>
                <div className="clink__v">{site.email}</div>
              </div>
              <span className="prow__arrow" aria-hidden="true">↗</span>
            </a>
            <a className="clink" href={site.instagram} target="_blank" rel="noopener noreferrer">
              <div>
                <div className="meta">Instagram — DM open</div>
                <div className="clink__v">{site.instagramHandle}</div>
              </div>
              <span className="prow__arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <form className="contact__form" noValidate data-fade="" data-delay="0.2" action={`mailto:${site.email}`} method="post" encType="text/plain">
          <h2 className="eyebrow" style={{ color: 'var(--gold)' }}>Booking inquiry</h2>
          <div className="field">
            <input id="f-name" name="name" type="text" placeholder=" " autoComplete="name" required />
            <label htmlFor="f-name">Your name / brand</label>
            <span className="field__err" data-err="name" />
          </div>
          <div className="field">
            <input id="f-email" name="email" type="email" placeholder=" " autoComplete="email" required />
            <label htmlFor="f-email">Email</label>
            <span className="field__err" data-err="email" />
          </div>
          <div className="field">
            <textarea id="f-msg" name="message" rows={5} placeholder=" " required />
            <label htmlFor="f-msg">Project — dates, location, usage</label>
            <span className="field__err" data-err="message" />
          </div>
          <button type="submit" className="btn btn--light" data-magnetic="0.15">Send inquiry</button>
          <div className="form-status" role="status" aria-live="polite" />
        </form>
      </section>
    </div>
  );
}
