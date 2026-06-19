import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollAnchor() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setActiveLink(`/${location.hash}`);
      return;
    }
    if (location.pathname === '/') {
      setActiveLink('/#hero');
      return;
    }
    setActiveLink(undefined);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;
    const targetId = location.hash.slice(1);
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return { activeLink, setActiveLink };
}
