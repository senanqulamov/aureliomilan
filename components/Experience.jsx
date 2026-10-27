'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Boots the motion layer (smooth scroll, WebGL, transitions) once, and tells it
// when the route changes. All page markup stays server-rendered.
export default function Experience() {
  const router = useRouter();
  const pathname = usePathname();
  const api = useRef(null);

  useEffect(() => {
    let alive = true;
    import('@/lib/motion/experience').then(({ start }) => {
      if (!alive) return;
      api.current = start({
        push: (path) => router.push(path, { scroll: false }),
        prefetch: (path) => router.prefetch(path),
      });
      api.current.routeChanged(window.location.pathname);
    });
    return () => {
      alive = false;
    };
  }, [router]);

  useEffect(() => {
    api.current && api.current.routeChanged(pathname);
  }, [pathname]);

  return null;
}
