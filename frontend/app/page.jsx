import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Brand from '../components/layout/Brand';

const roles = [
  { href: '/child', label: 'For young people', detail: 'Check something that feels wrong, or tell us what happened.', action: 'Open safety check' },
  { href: '/parent', label: 'For parents', detail: 'Connect your family and see the safety alerts that matter.', action: 'Open family space' },
  { href: '/admin', label: 'For administrators', detail: 'Review reported threats and investigate emerging scam patterns.', action: 'Open dashboard' }
];

export default function Home() {
  return <main className="landing-page">
    <header className="landing-nav">
      <Brand/>
      <nav aria-label="Landing navigation"><a href="#how-it-helps">How it helps</a><a href="#demo-access">Explore Chinga</a></nav>
      <Link href="/admin" className="nav-cta">Open dashboard <ArrowRight size={17}/></Link>
    </header>

    <section className="landing-hero">
      <div className="hero-visual">
        <Image src="/images/chinga-family-safety-hero.webp" width={1536} height={1024} preload unoptimized alt="An illustrative scene of a Ugandan teenager and guardian checking a phone together"/>
      </div>
      <div className="hero-copy">
        <p className="hero-kicker">Built for young people in Uganda</p>
        <h1>A message feels wrong.<br/>Let’s check it together.</h1>
        <p className="hero-summary">A surprise reward. A scholarship fee. Someone asking for a secret code. Chinga gives young people a place to pause, check a message, and ask for help.</p>
        <div className="hero-actions"><Link href="/child" className="hero-primary">Check a message <ArrowRight/></Link><Link href="/parent" className="hero-secondary">I’m a parent</Link></div>
        <p className="hero-footnote">Try the prototype with a sample message. Results are simulated.</p>
      </div>
    </section>

    <section className="confidence-strip" id="how-it-helps">
      <div><strong>Check before you act.</strong><p>Bring the message or link that made you stop and think.</p></div>
      <div><strong>You can ask for help.</strong><p>If something already happened, there is a place to explain it.</p></div>
      <div><strong>Your privacy matters.</strong><p>Parents see relevant alerts, not your entire conversation.</p></div>
    </section>

    <section className="access-section" id="demo-access">
      <div className="access-heading"><div><p className="section-kicker">Three spaces. One purpose.</p><h2>A safer next step.</h2></div><p>Explore each role using a demo account. All records are synthetic, and live analysis is still in development.</p></div>
      <div className="access-grid">{roles.map(({ href, label, detail, action }) => <Link href={href} className="access-card" key={href}><h3>{label}</h3><p>{detail}</p><span>{action}<ArrowRight size={18}/></span></Link>)}</div>
    </section>
    <footer className="landing-footer"><Brand/><p>UCC Testbed Hackathon 2026 · Working prototype</p><small>Illustrative AI-generated photograph. Reports are not sent to an authority.</small></footer>
  </main>;
}
