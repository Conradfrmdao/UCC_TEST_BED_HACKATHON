'use client';
import { useEffect } from 'react';
export default function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;
    const hadController = Boolean(navigator.serviceWorker.controller);
    let refreshed = false;
    function onControllerChange() {
      if (hadController && !refreshed) {
        refreshed = true;
        window.location.reload();
      }
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    let worker = '/sw.js';
    if (process.env.NODE_ENV === 'development') worker += '?development=1';
    navigator.serviceWorker.register(worker, { scope: '/', updateViaCache: 'none' })
      .then((registration) => registration.update())
      .catch((error) => console.warn('Offline support could not update:', error.message));
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);
  return null;
}
