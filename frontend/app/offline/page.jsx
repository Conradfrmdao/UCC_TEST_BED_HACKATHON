import Link from 'next/link';

export default function Offline() {
  return <main className="center-page"><div className="empty-panel">
    <p className="eyebrow">Chinga / connection</p>
    <h1>We can’t reach the app right now.</h1>
    <p>Chinga needs a connection to its server. Once the connection is back, open the page you need.</p>
    <div className="button-row"><Link className="button primary" href="/admin">Open dashboard</Link><Link className="button secondary" href="/child">Open safety check</Link></div>
  </div></main>;
}
