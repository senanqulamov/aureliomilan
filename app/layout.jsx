import localFont from 'next/font/local';
import { site, nav } from '@/lib/content';
import { siteSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import Roll from '@/components/Roll';
import Experience from '@/components/Experience';
import './globals.css';

const serif = localFont({
  src: [
    { path: './fonts/cg.woff2', style: 'normal', weight: '300 700' },
    { path: './fonts/cgi.woff2', style: 'italic', weight: '300 700' },
  ],
  variable: '--font-serif',
  display: 'swap',
});

const sans = localFont({
  src: [{ path: './fonts/jost.woff2', style: 'normal', weight: '100 900' }],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: site.keywords,
  category: 'fashion',
  alternates: { canonical: '/' },
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    url: '/',
    title: site.title,
    description: site.description,
    images: [{ url: site.shareImage, width: 1200, height: 630, alt: `${site.name} on the red carpet at Cannes` }],
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [site.shareImage] },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF6EF' },
    { media: '(prefers-color-scheme: dark)', color: '#13110E' },
  ],
};

// Runs before first paint: saved theme (or system setting) and whether the intro already played this visit.
const bootScript = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem('am-theme')}catch(e){}
if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.setAttribute('data-theme',t);
try{if(sessionStorage.getItem('am-intro'))d.setAttribute('data-intro','skip')}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{'.preloader{display:none}body.is-loading{overflow:auto}'}</style>
        </noscript>
        <JsonLd data={siteSchema()} />
      </head>
      <body className="is-loading">
        <a className="skip" href="#app">
          Skip to content
        </a>

        <div className="preloader" aria-hidden="true">
          <div className="preloader__stack" />
          <div className="preloader__name">
            <span>Aurelio</span>
            <span>
              <em>Milan</em>
            </span>
          </div>
          <div className="preloader__count">
            <span className="preloader__num">0</span>
          </div>
          <div className="preloader__meta">{site.tagline}</div>
        </div>

        <div className="curtain" aria-hidden="true">
          <div className="curtain__bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="curtain__center">
            <div className="curtain__label">
              <em />
            </div>
            <div className="curtain__line">
              <i />
            </div>
          </div>
        </div>

        <canvas className="gl" aria-hidden="true" />

        <header className="header">
          <a href="/public" className="logo" data-link="" aria-label={`${site.name} — home`}>
            Aurelio&nbsp;Milan
          </a>
          <nav className="nav" aria-label="Main">
            {nav.map((n) => (
              <a key={n.path} href={n.path} data-link="">
                <Roll>{n.label}</Roll>
              </a>
            ))}
          </nav>
          <button className="theme-toggle" type="button" aria-label="Switch to dark mode" data-magnetic="0.3">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle cx="12" cy="12" r="10.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M12 1.75a10.25 10.25 0 0 1 0 20.5z" fill="currentColor" />
            </svg>
          </button>
          <a href="/contact" className="btn btn--primary header__cta" data-link="" data-magnetic="">
            <Roll>Book Aurelio</Roll>
          </a>
          <button className="burger" type="button" aria-label="Open menu" aria-expanded="false">
            <span />
            <span />
          </button>
        </header>

        <div className="menu" aria-hidden="true">
          <nav className="menu__nav" aria-label="Mobile">
            {[...nav, { path: '/contact', label: 'Book Aurelio' }].map((n, i) => (
              <a key={n.path + i} href={n.path} data-link="">
                <small>{String(i + 1).padStart(2, '0')}</small>
                <span>{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="menu__foot">
            <a className="menu__ig" href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram ↗
            </a>
            <span className="menu__mail">{site.email}</span>
          </div>
        </div>

        <main id="app" tabIndex={-1}>
          {children}
        </main>

        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" aria-hidden="true">
          <div className="lightbox__top">
            <span className="lightbox__count" />
            <button className="lb-close" type="button">
              Close ✕
            </button>
          </div>
          <div className="lightbox__stage">
            <img alt="" />
          </div>
          <div className="lightbox__bottom">
            <button className="lb-prev" type="button">
              ← Prev
            </button>
            <span className="lb-label" />
            <button className="lb-next" type="button">
              Next →
            </button>
          </div>
          <div className="lightbox__thumbs" />
        </div>

        <footer className="footer">
          <div className="footer__top">
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold)' }}>
                Booking
              </div>
              <a href={`mailto:${site.email}`} className="link-line footer__mail">
                {site.email}
              </a>
            </div>
            <nav className="footer__links" aria-label="Footer">
              {nav
                .filter((n) => n.path !== '/')
                .map((n) => (
                  <a key={n.path} href={n.path} data-link="">
                    {n.label}
                  </a>
                ))}
              <a className="ig" href={site.instagram} target="_blank" rel="noopener noreferrer">
                Instagram ↗
              </a>
            </nav>
          </div>
          <div className="footer__mark" aria-hidden="true">
            Aurelio <em>Milan</em>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
            <span>{site.footerNote}</span>
          </div>
        </footer>

        <div className="cursor" aria-hidden="true">
          <div className="cursor__dot" />
          <div className="cursor__ring">
            <span className="cursor__label" />
          </div>
        </div>
        <div className="grain" aria-hidden="true" />

        <Experience />
      </body>
    </html>
  );
}
