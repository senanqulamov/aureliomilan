import { site, home, about, fashion, gallery, press, blog, p } from '@/lib/content';

const abs = (path) => new URL(path, site.url).toString();
const imgs = (keys) => [...new Set(keys)].map((k) => abs(p(k).l));

export default function sitemap() {
  const lastModified = new Date();
  return [
    { url: abs('/'), lastModified, changeFrequency: 'monthly', priority: 1, images: imgs([home.heroImage, ...home.cannes.images.map((i) => i.key)]) },
    { url: abs('/fashion'), lastModified, changeFrequency: 'monthly', priority: 0.9, images: imgs(fashion.projects.flatMap((pr) => pr.images.map((i) => i.key))) },
    { url: abs('/gallery'), lastModified, changeFrequency: 'monthly', priority: 0.9, images: imgs(gallery.items.map((g) => g.key)) },
    { url: abs('/about'), lastModified, changeFrequency: 'yearly', priority: 0.8, images: imgs([about.portrait, ...about.closing.map((c) => c.key)]) },
    { url: abs('/press'), lastModified, changeFrequency: 'monthly', priority: 0.7, images: imgs(press.events.map((e) => e.key)) },
    { url: abs('/blog'), lastModified, changeFrequency: 'weekly', priority: 0.7, images: imgs(blog.posts.map((b) => b.key)) },
    { url: abs('/contact'), lastModified, changeFrequency: 'yearly', priority: 0.6 },
  ];
}
