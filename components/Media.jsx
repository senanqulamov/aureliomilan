import { p } from '@/lib/content';

export function imgProps(key, { sizes = '(max-width: 860px) 92vw, 40vw', eager = false } = {}) {
  const ph = p(key);
  return {
    src: ph.s,
    srcSet: `${ph.s} 800w, ${ph.l} 1600w`,
    sizes,
    width: ph.w,
    height: ph.h,
    'data-key': key,
    loading: eager ? 'eager' : 'lazy',
    fetchPriority: eager ? 'high' : undefined,
    decoding: 'async',
  };
}

// A photo frame. The image is mirrored onto the WebGL layer when available.
export default function Media({ photo, alt, className = '', reveal = true, eager = false, sizes, cursor, ...rest }) {
  return (
    <figure className={`media ${className}`} data-reveal={reveal ? '' : undefined} data-cursor={cursor} {...rest}>
      <img {...imgProps(photo, { sizes, eager })} alt={alt} data-gl="" />
    </figure>
  );
}
