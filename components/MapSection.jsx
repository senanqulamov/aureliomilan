import { map } from '@/lib/content';
import { MAP, LAND, HIGHLIGHT_LAND, BORDERS } from '@/lib/map-data';

// Mercator → map units (same projection as scripts/build-map.mjs)
function project(lat, lon) {
  const r = Math.PI / 180;
  return [MAP.scale * lon * r + MAP.tx, -MAP.scale * Math.log(Math.tan(Math.PI / 4 + (lat * r) / 2)) + MAP.ty];
}

export default function MapSection() {
  const pts = map.places.map((pl) => {
    const [x, y] = project(pl.lat, pl.lon);
    return { ...pl, x, y, lx: x + pl.dx, ly: y + pl.dy };
  });
  return (
    <section className="map" aria-labelledby="map-title">
      <div className="wrap map__head">
        <div>
          <span className="eyebrow" data-fade="">{map.eyebrow}</span>
          <h2 id="map-title" className="h-sec" data-split="">
            {map.title[0]} <em>{map.title[1]}</em>
          </h2>
        </div>
        <p className="lead" data-fade="">{map.sub}</p>
      </div>
      <div className="map__frame wrap">
        <div className="map__canvas">
          <svg className="map__svg" viewBox={`0 0 ${MAP.w} ${MAP.h}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path className="map__land" d={LAND} />
            <path className="map__hi" d={HIGHLIGHT_LAND} />
            <path className="map__borders" d={BORDERS} />
            {pts.map((pt) => (
              <g key={pt.id} className={`map__place${pt.upcoming ? ' is-upcoming' : ''}`} data-id={pt.id}>
                <line className="map__lead" x1={pt.x} y1={pt.y} x2={pt.lx} y2={pt.ly} />
                <circle className="map__pulse" cx={pt.x} cy={pt.y} r="7" />
                <circle className="map__dot" cx={pt.x} cy={pt.y} r="5" />
              </g>
            ))}
          </svg>
          {pts.map((pt) => (
            <button
              key={pt.id}
              type="button"
              className={`map__pill${pt.upcoming ? ' is-upcoming' : ''}`}
              data-id={pt.id}
              style={{ left: `${(pt.lx / MAP.w) * 100}%`, top: `${(pt.ly / MAP.h) * 100}%` }}
              aria-label={`${pt.city}, ${pt.country} ${pt.year} — ${pt.title}`}
            >
              <span className="map__tags">
                <span>{pt.country}</span>
                <span>{pt.year}</span>
              </span>
              <span className="map__title">
                {pt.city} · {pt.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Filled in on the client when a place is selected; the list below is for crawlers and no-JS. */}
      <div className="wrap map__panel" aria-live="polite">
        <ul className="visually-hidden">
          {map.places.map((pl) => (
            <li key={pl.id}>
              {pl.city}, {pl.country} ({pl.year}): {pl.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
