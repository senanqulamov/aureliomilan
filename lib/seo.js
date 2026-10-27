import { site, seo, person, about, p } from './content';

const abs = (path) => new URL(path, site.url).toString();

export function pageMetadata(path) {
  const entry = seo[path] || seo['/'];
  const isHome = path === '/';
  const title = isHome ? { absolute: entry.title } : entry.title;
  const fullTitle = isHome ? entry.title : `${entry.title} — ${site.name}`;
  return {
    title,
    description: entry.description,
    alternates: { canonical: path },
    openGraph: {
      type: path === '/about' ? 'profile' : 'website',
      url: path,
      siteName: site.name,
      locale: site.locale,
      title: fullTitle,
      description: entry.description,
      images: [{ url: site.shareImage, width: 1200, height: 630, alt: `${site.name} on the red carpet at Cannes` }],
      ...(path === '/about' ? { firstName: 'Aurelio', lastName: 'Milan', gender: 'male' } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: entry.description,
      images: [site.shareImage],
    },
  };
}

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': abs('/#person'),
    name: person.name,
    alternateName: person.alternateName,
    jobTitle: person.jobTitle,
    description: site.description,
    url: site.url,
    email: `mailto:${site.email}`,
    image: [abs(p('red-carpet-05').l), abs(p(about.portrait).l), abs(p('general-01').l)],
    height: { '@type': 'QuantitativeValue', value: person.heightCm, unitCode: 'CMT' },
    homeLocation: { '@type': 'Place', name: person.homeLocation },
    knowsLanguage: person.languages,
    alumniOf: { '@type': 'CollegeOrUniversity', name: person.education },
    knowsAbout: person.knowsAbout,
    sameAs: [site.instagram],
  };
}

export function siteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema(),
      {
        '@type': 'WebSite',
        '@id': abs('/#website'),
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: 'en',
        publisher: { '@id': abs('/#person') },
        about: { '@id': abs('/#person') },
      },
    ],
  };
}

export function breadcrumbSchema(path) {
  const entry = seo[path];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: entry.title, item: abs(path) },
    ],
  };
}

export function webPageSchema(path, type = 'WebPage', extra = {}) {
  const entry = seo[path];
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': abs(`${path}#webpage`),
    url: abs(path),
    name: path === '/' ? entry.title : `${entry.title} — ${site.name}`,
    description: entry.description,
    inLanguage: 'en',
    isPartOf: { '@id': abs('/#website') },
    about: { '@id': abs('/#person') },
    ...extra,
  };
}

export const imageObject = (key, caption) => ({
  '@type': 'ImageObject',
  contentUrl: abs(p(key).l),
  width: p(key).w,
  height: p(key).h,
  caption,
  creditText: site.name,
  copyrightNotice: `© ${site.name}`,
});

export { abs };
