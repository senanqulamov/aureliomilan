export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="wrap notfound" data-route="404">
      <p className="eyebrow">404</p>
      <h1 className="h-page">
        Lost in <em>Milano.</em>
      </h1>
      <p className="lead">This page doesn&apos;t exist, or has moved.</p>
      <div>
        <a className="btn btn--primary" href="/public" data-link="">Back to home</a>
      </div>
    </div>
  );
}
