import Image from 'next/image';
import Link from 'next/link';
import Brand from '../components/layout/Brand';

const androidDownload = process.env.ANDROID_APK_URL || 'https://expo.dev/artifacts/eas/sBRTQFOqlqYCFCFY3pLDbtzxY54p_-hnVyk7daGqRiQ.apk';

const roles = [
  { href: '/child', label: 'For young people', detail: 'Try the message-check, reporting and help experience with synthetic examples.', action: 'Explore the child demo' },
  { href: '/parent', label: 'For parents', detail: 'Preview family pairing, proportionate alerts and protection preferences.', action: 'Explore the parent demo' }
];

export default function Home() {
  return <main className="landing-page">
    <header className="landing-nav">
      <Brand/>
      <nav aria-label="Landing navigation"><a href="#how-it-helps">How it helps</a><a href="#install">Install</a><a href="#privacy">Privacy</a></nav>
      <a href={androidDownload} className="nav-cta">Download Android</a>
    </header>

    <section className="landing-hero">
      <div className="hero-visual">
        <Image src="/images/chinga-family-safety-hero.webp" width={1536} height={1024} preload unoptimized alt="An illustrative scene of a Ugandan teenager and guardian checking a phone together"/>
      </div>
      <div className="hero-copy">
        <p className="hero-kicker">Built for young people in Uganda</p>
        <h1>A message feels wrong.<br/>Let’s check it together.</h1>
        <p className="hero-summary">A surprise reward. A scholarship fee. Someone asking for a secret code. Chinga gives young people a place to pause, check a message, and ask for help.</p>
        <div className="hero-actions"><a href={androidDownload} className="hero-primary">Download for Android</a><Link href="/child" className="hero-secondary">Try the web demo</Link></div>
        <p className="hero-footnote">Android 7 or newer · Version 1.3.0 · Frontend prototype with simulated results</p>
      </div>
    </section>

    <section className="confidence-strip" id="how-it-helps">
      <div><strong>Check before you act.</strong><p>Bring the message or link that made you stop and think.</p></div>
      <div><strong>You can ask for help.</strong><p>If something already happened, there is a place to explain it.</p></div>
      <div><strong>Your privacy matters.</strong><p>Parents should receive relevant alerts, not entire private conversations.</p></div>
    </section>

    <section className="install-section" id="install">
      <div className="install-copy"><p className="section-kicker">Android test release</p><h2>Install Chinga on your phone.</h2><p>The APK is signed for direct installation and supports common ARM and Intel Android devices running Android 7 or newer.</p><a href={androidDownload} className="hero-primary">Download APK</a></div>
      <ol className="install-steps">
        <li><span>01</span><div><strong>Download the APK</strong><p>Open this page on the Android phone and tap Download APK.</p></div></li>
        <li><span>02</span><div><strong>Allow this installation</strong><p>If Android asks, allow your browser to install this one app. Keep Play Protect enabled.</p></div></li>
        <li><span>03</span><div><strong>Open Chinga</strong><p>Choose parent or child. Demo verification uses 123456; no SMS is sent.</p></div></li>
      </ol>
    </section>

    <section className="access-section" id="privacy">
      <div className="access-heading"><div><p className="section-kicker">Clear about what works</p><h2>Start with a connected family.</h2></div><p>The Android demo can link a parent and child phone using a short-lived, single-use code. Live analysis, VPN filtering, push notifications and report submission are not active in this release.</p></div>
      <div className="access-grid">{roles.map(({ href, label, detail, action }) => <Link href={href} className="access-card" key={href}><h3>{label}</h3><p>{detail}</p><span>{action}</span></Link>)}</div>
    </section>
    <footer className="landing-footer"><Brand/><p>UCC Testbed Hackathon 2026 · Working prototype</p><small>The Android and web experiences use synthetic data. Reports are not sent to an authority. Call 116 opens the phone dialler and the user chooses whether to place the call.</small></footer>
  </main>;
}
