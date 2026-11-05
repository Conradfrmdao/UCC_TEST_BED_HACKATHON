'use client';

import Brand from '../layout/Brand';
import { useEffect, useState } from 'react';
import { ArrowLeft, Camera, Check, ChevronRight, Clock3, Home, ImagePlus, Send, ShieldCheck, Users, X } from 'lucide-react';
import { childHistory } from '@chinga/demo-data';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export default function ChildExperience() {
  const [screen, setScreen] = useState('home');
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [report, setReport] = useState('');
  const [confidential, setConfidential] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  useEffect(() => {
    const values = new URLSearchParams(window.location.search);
    const shared = [values.get('text'), values.get('url')].filter(Boolean).join('\n');
    if (!shared) return undefined;
    const timer = window.setTimeout(() => { setContent(shared); setScreen('check'); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  async function analyse() {
    setBusy(true); setResult(null);
    try { const response = await fetch(`${API}/api/demo/analyse`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error?.message); setResult(body.data); }
    catch { setResult({ kind: 'analysis_unavailable', riskLevel: 'unknown', explanation: 'The demo analyser is unavailable right now. Do not assume this message is safe.', recommendedActions: ['Do not share passwords, PINs, or OTP codes.', 'Ask a trusted adult for help if it is safe.'], signals: [] }); }
    finally { setBusy(false); }
  }
  async function submitReport() {
    setBusy(true);
    try { const response = await fetch(`${API}/api/reports`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ summary: report, confidential }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error?.message); setSubmitted(body.data); }
    catch (error) { setSubmitted({ error: error.message || 'Could not save the demo report.' }); }
    finally { setBusy(false); }
  }
  function back() { setResult(null); setScreen('home'); }
  return <div className="child-app"><header className="child-header"><Brand subtitle="Safety companion"/><button className="family-link" onClick={() => setScreen('pair')}>My family <ChevronRight size={16}/></button></header>
    <main className="child-main">
      {screen === 'home' && <HomeScreen setScreen={setScreen}/>} 
      {screen === 'check' && <CheckScreen content={content} setContent={setContent} file={file} setFile={setFile} busy={busy} analyse={analyse} result={result} setResult={setResult} back={back}/>} 
      {screen === 'report' && <ReportScreen report={report} setReport={setReport} confidential={confidential} setConfidential={setConfidential} submit={submitReport} busy={busy} submitted={submitted} back={back}/>} 
      {screen === 'history' && <History back={back}/>} 
      {screen === 'pair' && <Pairing back={back}/>} 
    </main>
    <nav className="child-nav" aria-label="Child navigation"><button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}><Home/><span>Home</span></button><button className={screen === 'check' ? 'active' : ''} onClick={() => setScreen('check')}><ShieldCheck/><span>Check</span></button><button className={screen === 'history' ? 'active' : ''} onClick={() => setScreen('history')}><Clock3/><span>History</span></button><button className={screen === 'pair' ? 'active' : ''} onClick={() => setScreen('pair')}><Users/><span>Family</span></button></nav>
  </div>;
}

function HomeScreen({ setScreen }) { return <><section className="child-welcome"><p className="eyebrow">Good morning, Kato</p><h1>Not sure about something online?</h1><p>You can check it before you reply. You will not get in trouble for asking.</p></section><section className="child-actions"><button className="child-action safe" onClick={() => setScreen('check')}><strong>Is this safe?</strong><small>Check a message, link, or screenshot</small><ChevronRight/></button><button className="child-action happened" onClick={() => setScreen('report')}><strong>Something happened</strong><small>Tell us what happened and choose who is told</small><ChevronRight/></button></section><section className="child-tip"><div><strong>Remember</strong><p>Never share your PIN, password, or one-time code. Real helpers should not ask for them.</p></div></section><p className="demo-banner">This is a simulated safety demo. It does not replace emergency or professional help.</p></>; }

function ScreenTop({ title, back }) { return <div className="screen-top"><button className="icon-button" onClick={back} aria-label="Back"><ArrowLeft/></button><div><p className="eyebrow">Private demo space</p><h1>{title}</h1></div></div>; }
function CheckScreen({ content, setContent, file, setFile, busy, analyse, result, setResult, back }) {
  if (result) return <Result result={result} reset={() => setResult(null)} back={back}/>;
  function chooseFile(event) { const chosen = event.target.files?.[0]; if (!chosen) return; if (!['image/png','image/jpeg','image/webp'].includes(chosen.type) || chosen.size > 5 * 1024 * 1024) { alert('Choose a PNG, JPEG, or WebP image smaller than 5 MB.'); return; } setFile(chosen); }
  return <><ScreenTop title="Is this safe?" back={back}/><section className="child-card"><p>Paste the exact message or link. The demo never opens links automatically.</p><label className="field"><span>Message or link</span><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Example: You won UGX 500,000. Send your Mobile Money PIN..." rows={7}/></label><div className="example-row"><button onClick={() => setContent('Congratulations! You won UGX 500,000. Send your Mobile Money PIN to claim the cash reward.')}>Try reward example</button><button onClick={() => setContent('You have a full scholarship. Pay a processing fee today.')}>Try scholarship example</button></div><label className="upload-box"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseFile}/><ImagePlus/><span><strong>Add a screenshot</strong><small>PNG, JPEG or WebP · up to 5 MB</small></span></label>{file && <div className="file-row"><Camera/><span><strong>{file.name}</strong><small>{Math.round(file.size / 1024)} KB · preview selected only</small></span><button onClick={() => setFile(null)} aria-label="Remove screenshot"><X/></button></div>}<button className="button primary full large" disabled={busy || !content.trim()} onClick={analyse}>{busy ? 'Checking the demo…' : 'Check this now'} <Send/></button><p className="safety-caption">Only known examples receive a simulated verdict. Other content returns “analysis not available.” Screenshot understanding is not connected yet.</p></section></>;
}
function Result({ result, reset, back }) { const high = result.riskLevel === 'high'; const unknown = result.riskLevel === 'unknown'; let heading = 'Some warning signs were found'; if (high) heading = 'Stop — this looks high risk'; if (unknown) heading = 'We could not check this yet'; return <><ScreenTop title="Your result" back={back}/><section className={`result-card ${result.riskLevel}`}><p className="demo-label">SIMULATED DEMO RESULT</p><h2>{heading}</h2><p>{result.explanation}</p></section>{result.signals?.length > 0 && <section className="child-card"><h3>What we noticed</h3><ul className="friendly-list">{result.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul></section>}<section className="child-card"><h3>What to do now</h3><ol className="action-steps">{result.recommendedActions.map((action, index) => <li key={action}><span>{index + 1}</span>{action}</li>)}</ol></section><div className="button-row"><button className="button primary" onClick={reset}>Check another</button><button className="button secondary" onClick={back}>Back home</button></div></>; }

function ReportScreen({ report, setReport, confidential, setConfidential, submit, busy, submitted, back }) { if (submitted && !submitted.error) return <><ScreenTop title="Report saved" back={back}/><section className="child-card success-panel"><h2>Thank you for telling us.</h2><p>Your report was saved in this demo as <strong>{submitted.id}</strong>. It was not sent to UCC, Police, or another authority.</p>{confidential && <p>Your confidential choice was kept. A guardian alert was not created.</p>}<button className="button primary full" onClick={back}>Return home</button></section></>; return <><ScreenTop title="Something happened" back={back}/><section className="child-card"><div className="helper-intro"><div><strong>You are not in trouble.</strong><p>Tell us what happened in your own words. Never type a PIN or password.</p></div></div><label className="field"><span>What happened?</span><textarea rows={8} value={report} onChange={(e) => setReport(e.target.value)} placeholder="Someone said I won a scholarship and asked me to send money…"/></label><label className="check-row"><input type="checkbox" checked={confidential} onChange={(e) => setConfidential(e.target.checked)}/><span><strong>Keep this report confidential from my guardian</strong><small>Choose this if telling a guardian could make you less safe. A trained safeguarding process is still required in a real service.</small></span></label>{submitted?.error && <p className="inline-error">{submitted.error}</p>}<button className="button primary full large" disabled={busy || report.trim().length < 10} onClick={submit}>{busy ? 'Saving…' : 'Review and save demo report'}</button><p className="safety-caption">This prototype does not make a formal report or contact emergency services.</p></section></>; }
function History({ back }) { return <><ScreenTop title="My recent checks" back={back}/><div className="child-card history-list">{childHistory.map((item) => <div key={item.id}><span><strong>{item.label}</strong><small>{item.at}</small></span><span className={`badge ${item.tone}`}>{item.result}</span></div>)}</div><p className="safety-caption centered">History is limited in this demo. Parents do not see your full messages.</p></>; }
function Pairing({ back }) { const [code, setCode] = useState(''); const [paired, setPaired] = useState(false); return <><ScreenTop title="My family" back={back}/><section className="child-card"><h2>Connect with a trusted guardian</h2><p>Ask them to create a short family code. The real version will make every code single-use and short-lived.</p><label className="field"><span>Family code</span><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SAFE-4821"/></label><button className="button primary full" disabled={code.length < 4} onClick={() => setPaired(true)}>Connect in demo</button>{paired && <p className="inline-success"><Check/> Demo connection complete. No real account was changed.</p>}</section></>; }
