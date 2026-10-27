import { blog } from '@/lib/content';
import { pageMetadata, webPageSchema, breadcrumbSchema, imageObject } from '@/lib/seo';
import Media from '@/components/Media';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/blog');

export default function BlogPage() {
  const schema = webPageSchema('/blog', 'CollectionPage', {
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: blog.posts.map((po, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'CreativeWork', name: po.title, description: po.excerpt, genre: po.cat, image: imageObject(po.key, po.title) },
      })),
    },
  });

  return (
    <div className="wrap" data-route="/blog">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema('/blog')} />
      <section className="intro">
        <p className="eyebrow" data-fade="">Blog</p>
        <h1 className="h-page" data-split="">
          Milan,
          <br />
          <em>as it happens.</em>
        </h1>
        <p className="lead" data-fade="" data-delay="0.3">{blog.sub}</p>
      </section>
      <section className="posts" aria-label="Posts">
        {blog.posts.map((po) => (
          <article className="post" id={po.slug} key={po.slug}>
            <Media photo={po.key} alt={`Aurelio Milan — ${po.title}`} sizes="(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 30vw" />
            <div className="post__body">
              <p className="eyebrow">{po.cat} · {po.date}</p>
              <h2>{po.title}</h2>
              <p>{po.excerpt}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
