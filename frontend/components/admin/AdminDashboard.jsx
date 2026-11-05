'use client';

import Link from 'next/link';
import Brand from '../layout/Brand';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from 'recharts';
import { Bell, Building2, ChevronLeft, ChevronRight, FileText, Filter, LayoutDashboard, Menu, RadioTower, Search, ShieldAlert, X } from 'lucide-react';
import { alerts, buildOverview, campaigns, organisationName, organisations, reports, submissions } from '@chinga/demo-data';

const nav = [
  ['overview', 'Overview', LayoutDashboard], ['threats', 'Threat intelligence', ShieldAlert], ['campaigns', 'Scam waves', RadioTower],
  ['organisations', 'Organisations', Building2], ['reports', 'Incident reports', FileText], ['alerts', 'Alerts & activity', Bell]
];
const labels = { overview: ['Intelligence overview', 'Privacy-protected signals from synthetic submissions.'], threats: ['Threat intelligence', 'Search and review sanitised suspicious submissions.'], campaigns: ['Scam Wave Intelligence', 'Predefined demo associations. No ML clustering is claimed.'], organisations: ['Impersonated organisations', 'Institutions named by scammers are victims of impersonation, not perpetrators.'], reports: ['Incident reports', 'Review sanitised, fabricated reports and evidence metadata.'], alerts: ['Alerts & activity', 'Simulated parent-alert and emerging campaign events.'] };

function Badge({ value }) { return <span className={`badge ${String(value).replaceAll('_', '-')}`}>{String(value).replaceAll('_', ' ')}</span>; }
function IconButton({ children, label, onClick, className = '' }) { return <button className={`icon-button ${className}`} aria-label={label} onClick={onClick}>{children}</button>; }
function formatDate(value) { return new Intl.DateTimeFormat('en-UG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Kampala' }).format(new Date(value)); }

export default function AdminDashboard({ section }) {
  const router = useRouter();
  const [range, setRange] = useState(7);
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('all');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [reviewStatuses, setReviewStatuses] = useState({});
  const overview = buildOverview(range);
  const title = labels[section] || labels.overview;
  function go(next) { setMobileNav(false); setSelected(null); router.push(`/admin/${next === 'overview' ? '' : next}`); }
  return <div className={`admin-shell ${railCollapsed ? 'rail-collapsed' : ''}`}>
    <aside className={`admin-rail ${mobileNav ? 'open' : ''}`}>
      <div className="rail-brand"><Brand subtitle="Safety intelligence"/><IconButton label="Close navigation" className="rail-close" onClick={() => setMobileNav(false)}><X/></IconButton></div>
      <button className="rail-toggle" onClick={() => setRailCollapsed(!railCollapsed)} aria-label={railCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!railCollapsed}>{railCollapsed ? <ChevronRight/> : <ChevronLeft/>}</button>
      <div className="mode-note"><span>SYNTHETIC DATA</span><p>Administrator demo</p></div>
      <nav aria-label="Administrator navigation">{nav.map(([key, label, Icon]) => <button key={key} title={label} aria-label={label} aria-current={section === key ? 'page' : undefined} className={section === key ? 'active' : ''} onClick={() => go(key)}><Icon/><span>{label}</span></button>)}</nav>
      <div className="rail-footer"><strong>Authorised role</strong><span>Demo session · A. Nsubuga</span><Link href="/">Switch experience</Link></div>
    </aside>
    {mobileNav && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)}/>} 
    <main className="admin-main">
      <header className="admin-header"><IconButton label="Open navigation" className="menu-button" onClick={() => setMobileNav(true)}><Menu/></IconButton><div><p className="eyebrow">UCC administrator workspace</p><h1>{title[0]}</h1><p>{title[1]}</p></div><div className="header-actions"><span className="demo-chip">DEMO MODE</span><IconButton label="Notifications" onClick={() => go('alerts')}><Bell/></IconButton></div></header>
      {section === 'overview' && <Overview overview={overview} range={range} setRange={setRange} onSelect={setSelected} go={go}/>} 
      {section === 'threats' && <Threats query={query} setQuery={setQuery} risk={risk} setRisk={setRisk} status={status} setStatus={setStatus} onSelect={setSelected} reviewStatuses={reviewStatuses}/>} 
      {section === 'campaigns' && <Campaigns onSelect={setSelected}/>} 
      {section === 'organisations' && <Organisations onSelect={setSelected}/>} 
      {section === 'reports' && <Reports onSelect={setSelected}/>} 
      {section === 'alerts' && <Alerts/>} 
    </main>
    {selected && <DetailDrawer item={selected} onClose={() => setSelected(null)} status={reviewStatuses[selected.id] || selected.status} setStatus={(next) => setReviewStatuses((current) => ({ ...current, [selected.id]: next }))}/>} 
  </div>;
}

function Overview({ overview, range, setRange, onSelect, go }) {
  const cards = [
    ['Messages analysed', overview.analysed, 'Checks in selected fixture window'], ['Suspicious messages', overview.suspicious, `${Math.round(overview.suspicious / overview.analysed * 100)}% of demo checks`],
    ['High-risk evidence', overview.highRisk, 'Sanitised submissions in window'], ['Incident reports', overview.reports, 'Includes one restricted record'], ['Active scam waves', overview.activeCampaigns, 'Suspected or under review']
  ];
  return <div className="page-stack">
    <div className="toolbar"><div className="segmented" aria-label="Date range">{[3,7].map((days) => <button key={days} className={range === days ? 'active' : ''} onClick={() => setRange(days)}>{days} days</button>)}</div><span className="context-note">Through 4 Nov 2026 · EAT</span></div>
    <section className="stat-grid">{cards.map(([label, value, note]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</section>
    <section className="overview-grid">
      <article className="panel chart-panel"><div className="panel-title"><div><p className="eyebrow">Selected window</p><h2>Incident trend</h2></div><span>Derived from one fixture set</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={overview.trend}><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.22}/><stop offset="100%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e2e8f0" vertical={false}/><XAxis dataKey="date" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false} width={28}/><Tooltip/><Area type="monotone" dataKey="analysed" stroke="#2563eb" strokeWidth={2} fill="url(#chartFill)"/><Area type="monotone" dataKey="suspicious" stroke="#b45309" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer></div><div className="legend"><span><i className="green"/>Analysed</span><span><i className="amber"/>Suspicious</span></div></article>
      <article className="panel"><div className="panel-title"><div><p className="eyebrow">Current watchlist</p><h2>Recently detected</h2></div><button className="text-button" onClick={() => go('threats')}>View all</button></div><div className="activity-list">{overview.recentThreats.map((item) => <button key={item.id} onClick={() => onSelect({ type: 'submission', ...item })}><span className={`risk-dot ${item.risk}`}/><span><strong>{item.category}</strong><small>{organisationName(item.organisationId)} · {item.district}</small></span><Badge value={item.risk}/><ChevronRight/></button>)}</div></article>
      <article className="panel"><div className="panel-title"><div><p className="eyebrow">Evidence mentions</p><h2>Most impersonated</h2></div><button className="text-button" onClick={() => go('organisations')}>Explore</button></div><div className="rank-list">{overview.topOrganisations.slice(0,4).map((item, index) => <div key={item.id}><span>{String(index + 1).padStart(2,'0')}</span><p><strong>{item.name}</strong><small>{item.sector}</small></p><b>{item.count}</b></div>)}</div><p className="disclaimer">These organisations are being impersonated. They are not presented as responsible for the scams.</p></article>
      <article className="panel"><div className="panel-title"><div><p className="eyebrow">System log</p><h2>Recent activity</h2></div><button className="text-button" onClick={() => go('alerts')}>Full log</button></div><div className="timeline">{alerts.slice(0,4).map((item) => <div key={item.id}><span className={item.severity}/><p><strong>{item.title}</strong><small>{formatDate(item.at)}</small></p></div>)}</div></article>
    </section>
  </div>;
}

function Threats({ query, setQuery, risk, setRisk, status, setStatus, onSelect, reviewStatuses }) {
  const filtered = useMemo(() => submissions.filter((item) => {
    const haystack = `${item.id} ${item.category} ${organisationName(item.organisationId)} ${item.district} ${item.channel}`.toLowerCase();
    const currentStatus = reviewStatuses[item.id] || item.status;
    return haystack.includes(query.toLowerCase()) && (risk === 'all' || item.risk === risk) && (status === 'all' || currentStatus === status);
  }), [query, risk, status, reviewStatuses]);
  return <div className="page-stack"><div className="filter-bar"><label className="search-box"><Search/><span className="sr-only">Search submissions</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ID, category, organisation or district"/></label><label><span className="sr-only">Risk</span><select value={risk} onChange={(e) => setRisk(e.target.value)}><option value="all">All risks</option><option value="high">High risk</option><option value="suspicious">Suspicious</option></select></label><label><span className="sr-only">Review status</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="reviewing">Reviewing</option><option value="reviewed">Reviewed</option><option value="escalated">Escalated</option></select></label><span className="result-count"><Filter/> {filtered.length} records</span></div><DataTable items={filtered} onSelect={(item) => onSelect({ type: 'submission', ...item, status: reviewStatuses[item.id] || item.status })}/></div>;
}

function DataTable({ items, onSelect }) { return <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Submission</th><th>Date & time</th><th>Category</th><th>Risk</th><th>Impersonated organisation</th><th>Channel</th><th>District</th><th>Status</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td data-label="Submission"><strong>{item.id}</strong></td><td data-label="Date">{formatDate(item.at)}</td><td data-label="Category">{item.category}</td><td data-label="Risk"><Badge value={item.risk}/></td><td data-label="Organisation">{organisationName(item.organisationId)}</td><td data-label="Channel">{item.channel}</td><td data-label="District">{item.district}</td><td data-label="Status"><Badge value={item.status}/></td><td><button className="row-button" onClick={() => onSelect(item)}>Inspect <ChevronRight/></button></td></tr>)}</tbody></table></div>{items.length === 0 && <div className="empty-state"><Search/><h3>No matching submissions</h3><p>Try a broader search or clear a filter.</p></div>}</div>; }

function Campaigns({ onSelect }) { return <div className="card-grid campaigns">{campaigns.map((item) => <article className="panel campaign-card" key={item.id}><div className="campaign-top"><span className="campaign-id">{item.id}</span><Badge value={item.status}/></div><h2>{item.title}</h2><p>{item.reports} related synthetic reports across {item.districts.length} districts.</p><div className="mini-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={item.trend.map((value,index) => ({ index, value }))}><Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div><dl><div><dt>Impersonated institution</dt><dd>{organisationName(item.organisationId)}</dd></div><div><dt>Observed</dt><dd>{formatDate(item.firstObserved)} – {formatDate(item.latestObserved)}</dd></div><div><dt>Districts</dt><dd>{item.districts.join(', ')}</dd></div></dl><div className="techniques">{item.techniques.map((technique) => <span key={technique}>{technique}</span>)}</div><button className="button secondary full" onClick={() => onSelect({ type: 'campaign', ...item })}>Open campaign investigation <ChevronRight/></button></article>)}</div>; }

function Organisations({ onSelect }) { return <div className="panel org-list">{organisations.map((item) => { const count = submissions.filter((entry) => entry.organisationId === item.id).length; return <button key={item.id} onClick={() => onSelect({ type: 'organisation', ...item })}><span><strong>{item.name}</strong><small>{item.sector}</small></span><span className="org-count"><strong>{count}</strong><small>evidence mentions</small></span><span className="sparkline"><ResponsiveContainer width="100%" height="100%"><LineChart data={item.weekly.map((value,index) => ({index,value}))}><Line dataKey="value" stroke="#2563eb" strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></span><ChevronRight/></button>; })}</div>; }

function Reports({ onSelect }) { return <div className="panel report-list">{reports.map((item) => <button key={item.id} onClick={() => onSelect({ type: 'report', ...item })}><span><strong>{item.id} · {item.category}</strong><small>{item.summary}</small></span><span><Badge value={item.status}/><small>{formatDate(item.submittedAt)}</small></span><ChevronRight/></button>)}</div>; }
function Alerts() { return <div className="panel alert-list">{alerts.map((item) => <article key={item.id}><div><div><strong>{item.title}</strong><Badge value={item.type}/></div><p>{item.detail}</p><small>{formatDate(item.at)} · {item.id}</small></div></article>)}</div>; }

function DetailDrawer({ item, onClose, status, setStatus }) {
  const related = item.type === 'campaign' ? submissions.filter((entry) => item.submissionIds.includes(entry.id)) : [];
  return <div className="drawer-layer"><button className="drawer-scrim" aria-label="Close detail" onClick={onClose}/><aside className="detail-drawer" aria-label="Evidence detail"><header><div><p className="eyebrow">{item.type} detail</p><h2>{item.title || item.id || item.name}</h2></div><IconButton label="Close detail" onClick={onClose}><X/></IconButton></header><div className="drawer-body">
    {item.type === 'submission' && <><div className="detail-status"><Badge value={item.risk}/><Badge value={status}/><span>{formatDate(item.at)}</span></div><section><h3>Sanitised scam evidence</h3><blockquote>{item.evidence}</blockquote><p className="safety-caption">Displayed as inert text. No link in this evidence is opened automatically.</p></section><section><h3>Detected demo signals</h3><ul className="signal-list">{item.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul></section><section><h3>Context</h3><dl className="detail-list"><div><dt>Category</dt><dd>{item.category}</dd></div><div><dt>Impersonated organisation</dt><dd>{organisationName(item.organisationId)}</dd></div><div><dt>Channel / district</dt><dd>{item.channel} · {item.district}</dd></div><div><dt>Campaign</dt><dd>{item.campaignId}</dd></div></dl></section><section><h3>Demo review action</h3><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="new">New</option><option value="reviewing">Reviewing</option><option value="reviewed">Reviewed</option><option value="escalated">Escalated</option></select><p className="safety-caption">This local status change is not an official UCC action.</p></section></>}
    {item.type === 'campaign' && <><div className="detail-status"><Badge value={item.status}/><span>{item.reports} related reports</span></div><section className="notice"><strong>Grouping disclosure</strong><p>These records use predefined fixture associations. Actual similarity clustering has not run.</p></section><section><h3>Investigation summary</h3><dl className="detail-list"><div><dt>Institution impersonated</dt><dd>{organisationName(item.organisationId)}</dd></div><div><dt>First observed</dt><dd>{formatDate(item.firstObserved)}</dd></div><div><dt>Latest observed</dt><dd>{formatDate(item.latestObserved)}</dd></div><div><dt>Affected districts</dt><dd>{item.districts.join(', ')}</dd></div></dl></section><section><h3>Common techniques</h3><div className="techniques">{item.techniques.map((technique) => <span key={technique}>{technique}</span>)}</div></section><section><h3>Related suspicious messages</h3><div className="evidence-stack">{related.map((entry) => <article key={entry.id}><strong>{entry.id}</strong><p>{entry.evidence}</p></article>)}</div></section></>}
    {item.type === 'organisation' && <><section className="notice"><strong>Important distinction</strong><p>{item.disclaimer}</p></section><section><h3>Evidence linked to this name</h3><div className="evidence-stack">{submissions.filter((entry) => entry.organisationId === item.id).map((entry) => <article key={entry.id}><strong>{entry.id} · {entry.category}</strong><p>{entry.evidence}</p></article>)}</div></section></>}
    {item.type === 'report' && <><div className="detail-status"><Badge value={item.status}/><span>{formatDate(item.submittedAt)}</span></div><section><h3>Sanitised incident summary</h3><p>{item.summary}</p></section><section><h3>Supporting evidence metadata</h3><ul>{item.evidence.map((value) => <li key={value}>{value}</li>)}</ul></section>{item.confidential && <section className="notice danger"><strong>Restricted route</strong><p>General evidence is intentionally hidden because guardian notification or broad access may increase danger.</p></section>}<button className="button primary full">Mark reviewed in demo</button></>}
  </div></aside></div>;
}
