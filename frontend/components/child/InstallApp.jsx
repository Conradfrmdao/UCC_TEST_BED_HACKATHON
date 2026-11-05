'use client';

import { useEffect, useState } from 'react';

export default function InstallApp() {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    function available(event) { event.preventDefault(); setPrompt(event); }
    function completed() { setInstalled(true); setPrompt(null); }
    window.addEventListener('beforeinstallprompt', available);
    window.addEventListener('appinstalled', completed);
    return () => {
      window.removeEventListener('beforeinstallprompt', available);
      window.removeEventListener('appinstalled', completed);
    };
  }, []);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    setPrompt(null);
  }

  if (installed) return <p className="install-note" role="status">Chinga was added to your device.</p>;
  return <section className="install-note"><strong>Keep Chinga close</strong><p>On Android, open this page in Chrome and choose “Add to Home screen” from the browser menu.</p>{prompt && <button className="text-button" onClick={install}>Install Chinga</button>}</section>;
}
