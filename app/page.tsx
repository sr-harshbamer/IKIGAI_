"use client";

import { useMemo, useState } from "react";

type RiskLevel = "LOW" | "GUARDED" | "HIGH" | "CRITICAL";
type Signal = { label: string; detail: string; weight: number; tone: "danger" | "warn" | "info" };
type Incident = { id: number; time: string; title: string; detail: string; kind: "scan" | "hold" | "alert" };

const profiles = [
  { id: "dad", name: "Dad", role: "Family", initials: "DA", color: "mint" },
  { id: "bank", name: "Axis Bank", role: "Financial service", initials: "AB", color: "violet" },
  { id: "priya", name: "Priya", role: "Work teammate", initials: "PR", color: "peach" }
];

const starterMessages = [
  "Dad, this is my new number. I am in an emergency—please transfer ₹20,000 now and don't call anyone.",
  "Your bank account will be suspended today. Verify your OTP immediately at secure-account-check.com.",
  "Hi, can you review the project draft before tomorrow's meeting?"
];

function getClock() {
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function evaluate(text: string, profileName: string): { score: number; level: RiskLevel; signals: Signal[]; summary: string } {
  const value = text.toLowerCase();
  const signals: Signal[] = [];
  const includes = (words: string[]) => words.some((word) => value.includes(word));

  if (includes(["urgent", "immediately", "right now", "asap", "emergency", "today", "hurry"])) {
    signals.push({ label: "Urgency pressure", detail: "The sender is trying to prevent you from pausing and verifying.", weight: 18, tone: "danger" });
  }
  if (includes(["transfer", "upi", "rupee", "₹", "rs", "pay", "crypto", "gift card", "bank", "money"])) {
    signals.push({ label: "Money request", detail: "A payment or financial action is being requested.", weight: 24, tone: "danger" });
  }
  if (includes(["otp", "password", "pin", "cvv", "verify", "login", "account"])) {
    signals.push({ label: "Credential request", detail: "Sensitive account information may be at risk.", weight: 22, tone: "danger" });
  }
  if (includes(["suspend", "arrest", "police", "legal", "blocked", "fine", "consequence"])) {
    signals.push({ label: "Threat language", detail: "Fear or punishment is being used to force a quick decision.", weight: 16, tone: "warn" });
  }
  if (includes(["don't tell", "do not tell", "secret", "don’t tell"])) {
    signals.push({ label: "Secrecy request", detail: "Legitimate people rarely ask you to hide urgent money decisions.", weight: 16, tone: "danger" });
  }
  if (includes(["http", ".com", ".in", "link", "click"])) {
    signals.push({ label: "External destination", detail: "An off-platform link or destination needs verification.", weight: 10, tone: "warn" });
  }
  if (profileName !== "None" && includes(["new number", "lost my phone", "can't call", "do not call", "send it to"])) {
    signals.push({ label: "Relationship mismatch", detail: `This does not match the normal verification pattern you set for ${profileName}.`, weight: 17, tone: "info" });
  }

  const score = Math.min(98, signals.reduce((total, signal) => total + signal.weight, 4));
  const level: RiskLevel = score >= 70 ? "CRITICAL" : score >= 48 ? "HIGH" : score >= 23 ? "GUARDED" : "LOW";
  const summary = level === "LOW"
    ? "No strong scam pattern was found. Continue normally, but stay alert for changes in the conversation."
    : level === "GUARDED"
      ? "Pause before taking action. Verify the sender using a known channel."
      : "Do not send money, share credentials, or continue on any link until this request is independently verified.";

  return { score, level, signals, summary };
}

export default function Home() {
  const [message, setMessage] = useState(starterMessages[0]);
  const [selectedProfile, setSelectedProfile] = useState("dad");
  const [result, setResult] = useState(() => evaluate(starterMessages[0], "Dad"));
  const [isHeld, setIsHeld] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [activeSection, setActiveSection] = useState("Defense center");
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 1, time: "09:42", title: "Safety check completed", detail: "Suspicious payment request detected", kind: "scan" },
    { id: 2, time: "09:43", title: "Trusted circle notified", detail: "Priya received a verification prompt", kind: "alert" }
  ]);

  const profile = useMemo(() => profiles.find((item) => item.id === selectedProfile), [selectedProfile]);
  const profileName = profile?.name ?? "None";
  const confidence = Math.min(96, Math.max(62, result.score + 28));

  function addIncident(title: string, detail: string, kind: Incident["kind"]) {
    setIncidents((items) => [{ id: Date.now(), time: getClock(), title, detail, kind }, ...items].slice(0, 5));
  }

  function analyze() {
    const next = evaluate(message, profileName);
    setResult(next);
    setIsHeld(false);
    setAlertSent(false);
    addIncident("Safety check completed", `${next.level.toLowerCase()} risk · ${next.score}/100`, "scan");
  }

  function holdAction() {
    setIsHeld(true);
    addIncident("Protective hold enabled", "Outgoing payment or reply should be reviewed first", "hold");
  }

  function notifyCircle() {
    setAlertSent(true);
    addIncident("Trusted circle notified", "Dad and Priya received a verification request", "alert");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>◉</span></div>
          <div><strong>SentryCircle</strong><small>PROACTIVE DEFENSE</small></div>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          {["Defense center", "Trusted circle", "Incident timeline", "Safety settings"].map((item, index) => (
            <button key={item} className={activeSection === item ? "nav-item active" : "nav-item"} onClick={() => setActiveSection(item)}>
              <span>{["⌁", "◎", "◷", "⚙"][index]}</span>{item}
            </button>
          ))}
        </nav>

        <div className="circle-status">
          <div className="status-orbit"><span>3</span></div>
          <div><strong>Circle protected</strong><p>3 trusted people ready</p></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">REAL-TIME DEFENSE / {activeSection.toUpperCase()}</p>
            <h1>Pause the scam. <em>Protect the person.</em></h1>
          </div>
          <div className="secure-state"><span className="pulse" />Defense active</div>
        </header>

        <div className="hero-grid">
          <section className="analyzer panel">
            <div className="panel-heading">
              <div><span className="section-tag">LIVE CHECK</span><h2>Inspect a request</h2></div>
              <span className="privacy-pill">◌ processed locally</span>
            </div>

            <label htmlFor="message">Paste a message, call summary, or payment request</label>
            <textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What did they ask you to do?" />

            <div className="quick-row">
              <span>Try a scenario</span>
              {starterMessages.map((example, index) => <button key={example} onClick={() => setMessage(example)}>{["Family emergency", "Bank warning", "Normal message"][index]}</button>)}
            </div>

            <div className="context-row">
              <div><label htmlFor="profile">Who do they claim to be?</label><select id="profile" value={selectedProfile} onChange={(event) => setSelectedProfile(event.target.value)}>{profiles.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.role}</option>)}</select></div>
              <button className="analyze-button" onClick={analyze}><span>⌁</span> Analyze safely</button>
            </div>
          </section>

          <section className={`risk-card ${result.level.toLowerCase()}`}>
            <div className="risk-head"><span>RISK SIGNAL</span><span className="live-dot">LIVE</span></div>
            <div className="score-wrap"><div className="score-ring" style={{ "--score": `${result.score * 3.6}deg` } as React.CSSProperties}><b>{result.score}</b><span>/100</span></div><div><h2>{result.level}</h2><p>{result.level === "LOW" ? "Looks routine" : "Intervention suggested"}</p></div></div>
            <div className="confidence"><span>Signal confidence</span><strong>{confidence}%</strong><div><i style={{ width: `${confidence}%` }} /></div></div>
            <p className="risk-summary">{result.summary}</p>
          </section>
        </div>

        <section className="action-strip">
          <div><span className="shield-icon">◈</span><div><strong>{isHeld ? "Safety hold is active" : "Ready to protect you"}</strong><p>{isHeld ? "No action should continue until you review this request." : "SentryCircle can pause the next risky action for you."}</p></div></div>
          <div className="action-buttons"><button className={isHeld ? "hold-button held" : "hold-button"} onClick={holdAction}>{isHeld ? "✓ Action held" : "Hold action"}</button><button className={alertSent ? "notify-button sent" : "notify-button"} onClick={notifyCircle}>{alertSent ? "✓ Circle alerted" : "Notify my circle"}</button></div>
        </section>

        <div className="lower-grid">
          <section className="signals panel">
            <div className="panel-heading"><div><span className="section-tag">WHY WE PAUSED</span><h2>Explainable signals</h2></div><span className="plain-language">Plain language</span></div>
            {result.signals.length ? result.signals.map((signal) => <article className="signal" key={signal.label}><span className={`signal-icon ${signal.tone}`}>{signal.tone === "danger" ? "!" : signal.tone === "warn" ? "△" : "⌁"}</span><div><strong>{signal.label}</strong><p>{signal.detail}</p></div><b>+{signal.weight}</b></article>) : <div className="calm-state"><span>✓</span><div><strong>No strong manipulation signals</strong><p>The message does not contain pressure, payment, secrecy, or credential-request patterns.</p></div></div>}
          </section>

          <section className="timeline panel">
            <div className="panel-heading"><div><span className="section-tag">AUDIT TRAIL</span><h2>Incident timeline</h2></div><button className="text-button" onClick={() => setIncidents([])}>Clear</button></div>
            <div className="timeline-list">{incidents.length ? incidents.map((incident) => <article className="timeline-event" key={incident.id}><span className={`event-mark ${incident.kind}`} /><div><strong>{incident.title}</strong><p>{incident.detail}</p></div><time>{incident.time}</time></article>) : <p className="empty">Your next safety action will appear here.</p>}</div>
          </section>
        </div>

        <section className="trusted-panel panel">
          <div className="panel-heading"><div><span className="section-tag">TRUSTED CIRCLE</span><h2>People who can help verify</h2></div><button className="add-person">+ Add person</button></div>
          <div className="people-grid">{profiles.map((person) => <article className="person" key={person.id}><span className={`avatar ${person.color}`}>{person.initials}</span><div><strong>{person.name}</strong><p>{person.role}</p></div><span className="ready"><i />Ready</span></article>)}</div>
        </section>
      </section>
    </main>
  );
}
