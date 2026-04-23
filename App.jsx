
import { useState, useEffect, useCallback } from "react";

// ── Palette & theme ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0e17;
    --surface: #111827;
    --surface2: #1a2235;
    --border: #1f2d45;
    --accent: #00d4ff;
    --accent2: #7c3aed;
    --green: #10b981;
    --red: #ef4444;
    --amber: #f59e0b;
    --text: #e2e8f0;
    --muted: #64748b;
    --font-display: 'Inter', sans-serif;
    --font-mono: 'Inter', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-display); }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* header */
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 32px; border-bottom: 1px solid var(--border);
    background: rgba(10,14,23,0.9); backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 100;
  }
  .logo { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.5px; }
  .logo span { color: var(--accent); }
  .tagline { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); margin-top: 2px; }
  .last-update { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); text-align:right; }
  .pulse { display:inline-block; width:7px; height:7px; border-radius:50%; background:var(--green);
    animation: pulse 2s infinite; margin-right:6px; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

  /* tabs */
  .tabs { display: flex; gap: 4px; padding: 16px 32px 0; border-bottom: 1px solid var(--border); }
  .tab {
    padding: 10px 24px; border-radius: 8px 8px 0 0; cursor: pointer; font-weight: 600;
    font-size: 0.88rem; letter-spacing: 0.3px; transition: all 0.2s;
    border: 1px solid transparent; border-bottom: none; color: var(--muted);
  }
  .tab:hover { color: var(--text); background: var(--surface); }
  .tab.active { color: var(--accent); background: var(--surface); border-color: var(--border); }

  /* main */
  .main { padding: 28px 32px; flex: 1; }

  /* summary cards */
  .summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px 22px; position: relative; overflow: hidden;
  }
  .card::before {
    content:''; position:absolute; inset:0; opacity:0.04;
    background: linear-gradient(135deg, var(--accent), transparent);
    pointer-events:none;
  }
  .card-label { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
  .card-value { font-size: 1.6rem; font-weight: 800; letter-spacing: -1px; }
  .card-sub { font-family: var(--font-mono); font-size: 0.75rem; margin-top: 4px; }
  .up { color: var(--green); } .down { color: var(--red); } .neutral { color: var(--accent); }

  /* portfolio grid */
  .section-title { font-size: 1rem; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 16px; color: var(--text); }
  .section-title span { color: var(--muted); font-weight: 400; font-family: var(--font-mono); font-size: 0.8rem; margin-left: 8px; }

  .platforms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .platform-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 22px; cursor: pointer; transition: all 0.2s; position: relative;
  }
  .platform-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,212,255,0.08); }
  .platform-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .platform-name { font-size: 1rem; font-weight: 700; }
  .platform-type { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); margin-top: 3px; }
  .platform-badge {
    font-family: var(--font-mono); font-size: 0.65rem; padding: 3px 8px;
    border-radius: 20px; font-weight: 500; letter-spacing: 0.5px;
  }
  .badge-sol { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .badge-usd { background: rgba(0,212,255,0.12); color: var(--accent); }
  .badge-mix { background: rgba(124,58,237,0.15); color: #a78bfa; }
  .platform-amount { font-size: 1.7rem; font-weight: 800; letter-spacing: -1px; }
  .platform-currency { font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted); margin-bottom: 2px; }
  .platform-return { font-family: var(--font-mono); font-size: 0.8rem; margin-top: 8px; }
  .progress-bar { height: 3px; background: var(--border); border-radius: 2px; margin-top: 14px; }
  .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--accent2)); }

  /* allocation chart */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
  .alloc-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
  .alloc-item { display: flex; align-items: center; gap: 10px; }
  .alloc-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .alloc-name { flex: 1; font-size: 0.85rem; }
  .alloc-pct { font-family: var(--font-mono); font-size: 0.8rem; color: var(--muted); }
  .alloc-bar-wrap { height: 4px; background: var(--border); border-radius: 2px; margin-top: 4px; }
  .alloc-bar { height: 100%; border-radius: 2px; }

  /* edit modal overlay */
  .modal-bg {
    position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:200;
    display:flex; align-items:center; justify-content:center;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
    padding: 28px; width: 380px; max-width: 95vw;
  }
  .modal h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 18px; }
  .form-group { margin-bottom: 14px; }
  .form-label { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; display:block; }
  .form-input {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 14px; color: var(--text); font-family: var(--font-mono);
    font-size: 0.9rem; outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--accent); }
  .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn {
    flex: 1; padding: 10px; border-radius: 8px; font-family: var(--font-display);
    font-weight: 600; font-size: 0.85rem; cursor: pointer; border: none; transition: all 0.2s;
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: #33deff; }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }

  /* ── RADAR tab ── */
  .radar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .refresh-btn {
    display: flex; align-items: center; gap: 8px; background: var(--surface); border: 1px solid var(--border);
    color: var(--accent); border-radius: 8px; padding: 8px 16px; font-family: var(--font-display);
    font-weight: 600; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;
  }
  .refresh-btn:hover { background: var(--surface2); border-color: var(--accent); }
  .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .recs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
  .rec-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 20px; transition: all 0.2s;
  }
  .rec-card:hover { border-color: var(--accent); }
  .rec-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .rec-ticker { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.5px; }
  .rec-name { font-size: 0.75rem; color: var(--muted); margin-top: 2px; }
  .rec-badges { display: flex; gap: 6px; flex-wrap: wrap; }
  .badge {
    font-family: var(--font-mono); font-size: 0.62rem; padding: 3px 8px;
    border-radius: 20px; font-weight: 500; letter-spacing: 0.5px;
  }
  .badge-growth { background: rgba(16,185,129,0.15); color: var(--green); }
  .badge-value { background: rgba(0,212,255,0.12); color: var(--accent); }
  .badge-dividend { background: rgba(245,158,11,0.15); color: var(--amber); }
  .badge-etf { background: rgba(124,58,237,0.15); color: #a78bfa; }
  .badge-solid { background: rgba(255,255,255,0.07); color: var(--text); }
  .rec-price { font-family: var(--font-mono); font-size: 0.85rem; color: var(--muted); margin-bottom: 8px; }
  .rec-target { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .rec-target-label { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); }
  .rec-target-val { font-family: var(--font-mono); font-size: 0.75rem; font-weight: 500; }
  .rec-thesis { font-size: 0.82rem; color: var(--muted); line-height: 1.55; }
  .score-bar { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
  .score-label { font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); white-space: nowrap; }
  .score-track { flex:1; height: 4px; background: var(--border); border-radius: 2px; }
  .score-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--green)); }
  .score-num { font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent); }

  .disclaimer {
    background: var(--surface); border: 1px solid var(--amber);
    border-radius: 10px; padding: 12px 16px; font-family: var(--font-mono);
    font-size: 0.7rem; color: var(--amber); opacity: 0.85; margin-top: 8px;
  }

  .loading-box {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 48px; text-align: center; grid-column: span 2;
  }
  .loading-box p { color: var(--muted); font-family: var(--font-mono); font-size: 0.85rem; margin-top: 12px; }

  /* countdown */
  .countdown { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

// ── Default portfolio data ───────────────────────────────────────────────────
const DEFAULT_PLATFORMS = [
  { id: 1, name: "Tyba", type: "Fondos mutuos", currency: "PEN", amount: 3200, returnPct: 6.8, alloc: 22 },
  { id: 2, name: "Hapi", type: "Acciones / ETFs", currency: "USD", amount: 1450, returnPct: 12.3, alloc: 30 },
  { id: 3, name: "Magi SAF", type: "Fondo alternativo", currency: "USD", amount: 2100, returnPct: 9.1, alloc: 35 },
  { id: 4, name: "Efectivo PEN", type: "Disponible", currency: "PEN", amount: 800, returnPct: 0, alloc: 6 },
  { id: 5, name: "Efectivo USD", type: "Disponible", currency: "USD", amount: 300, returnPct: 0, alloc: 7 },
];

const COLORS = ["#00d4ff","#7c3aed","#10b981","#f59e0b","#ef4444","#06b6d4","#8b5cf6"];
const PEN_USD = 3.72; // tipo de cambio referencial

function formatMoney(amount, currency) {
  return `${currency === "USD" ? "$" : "S/ "}${amount.toLocaleString("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ── RADAR — fetch AI recommendations ────────────────────────────────────────
async function fetchRecommendations() {
  const prompt = `Eres un experto en finanzas e inversiones con enfoque en bolsa de valores global. 
El usuario tiene un perfil de riesgo MODERADO. Hoy es ${new Date().toLocaleDateString("es-PE", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}.

Genera recomendaciones de inversión actuales. Devuelve SOLO un JSON válido (sin markdown, sin backticks) con esta estructura exacta:
{
  "fecha": "string con fecha",
  "resumen_mercado": "2-3 oraciones sobre el contexto de mercado actual",
  "acciones": [
    {
      "ticker": "TICKER",
      "nombre": "Nombre empresa",
      "precio_actual": "$XXX",
      "precio_objetivo": "$XXX",
      "potencial": "+XX%",
      "tipo": "growth|value|dividend|etf",
      "rol": "Crecimiento|Base sólida|Dividendos|ETF diversificado",
      "score": 85,
      "tesis": "2-3 oraciones explicando por qué es buena inversión ahora y qué catalizadores tiene"
    }
  ]
}

Incluye exactamente 6 acciones/ETFs: 3 de crecimiento con potencial alto, 3 de base sólida/dividendos para portafolio moderado. Mezcla acciones estadounidenses, algunos ETFs globales. Sé específico con precios aproximados y análisis fundamentado.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function EditModal({ platform, onSave, onClose }) {
  const [amount, setAmount] = useState(platform.amount);
  const [ret, setRet] = useState(platform.returnPct);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Editar · {platform.name}</h3>
        <div className="form-group">
          <label className="form-label">Saldo actual ({platform.currency})</label>
          <input className="form-input" type="number" value={amount}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="form-group">
          <label className="form-label">Rendimiento YTD (%)</label>
          <input className="form-input" type="number" step="0.1" value={ret}
            onChange={e => setRet(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={() => { onSave({ ...platform, amount, returnPct: ret }); onClose(); }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ platforms, setPlatforms }) {
  const [editing, setEditing] = useState(null);

  // totals in USD
  const totalUSD = platforms.reduce((s, p) =>
    s + (p.currency === "USD" ? p.amount : p.amount / PEN_USD), 0);
  const totalPEN = totalUSD * PEN_USD;
  const weightedReturn = platforms.reduce((s, p) => s + p.returnPct * (p.alloc / 100), 0);
  const usdPlatforms = platforms.filter(p => p.currency === "USD");
  const penPlatforms = platforms.filter(p => p.currency === "PEN");

  // recalc alloc after edit
  const updatePlatform = (updated) => {
    const newList = platforms.map(p => p.id === updated.id ? updated : p);
    const totalVal = newList.reduce((s, p) =>
      s + (p.currency === "USD" ? p.amount : p.amount / PEN_USD), 0);
    const recalced = newList.map(p => ({
      ...p,
      alloc: Math.round(((p.currency === "USD" ? p.amount : p.amount / PEN_USD) / totalVal) * 100)
    }));
    setPlatforms(recalced);
  };

  return (
    <div>
      {editing && <EditModal platform={editing} onSave={updatePlatform} onClose={() => setEditing(null)} />}

      {/* summary */}
      <div className="summary-row">
        <div className="card">
          <div className="card-label">Total Portafolio (USD)</div>
          <div className="card-value neutral">{formatMoney(totalUSD, "USD")}</div>
          <div className="card-sub neutral">≈ S/ {totalPEN.toLocaleString("es-PE", {maximumFractionDigits:0})}</div>
        </div>
        <div className="card">
          <div className="card-label">Retorno promedio YTD</div>
          <div className="card-value up">+{weightedReturn.toFixed(1)}%</div>
          <div className="card-sub up">Por encima del mercado</div>
        </div>
        <div className="card">
          <div className="card-label">Posiciones en USD</div>
          <div className="card-value">{formatMoney(usdPlatforms.reduce((s,p)=>s+p.amount,0),"USD")}</div>
          <div className="card-sub neutral">{usdPlatforms.length} plataformas</div>
        </div>
        <div className="card">
          <div className="card-label">Posiciones en Soles</div>
          <div className="card-value">{formatMoney(penPlatforms.reduce((s,p)=>s+p.amount,0),"PEN")}</div>
          <div className="card-sub neutral">{penPlatforms.length} plataformas</div>
        </div>
      </div>

      {/* platforms */}
      <div className="section-title">Plataformas <span>clic para editar</span></div>
      <div className="platforms-grid">
        {platforms.map((p, i) => (
          <div key={p.id} className="platform-card" onClick={() => setEditing(p)}>
            <div className="platform-header">
              <div>
                <div className="platform-name">{p.name}</div>
                <div className="platform-type">{p.type}</div>
              </div>
              <span className={`platform-badge ${p.currency==="PEN"?"badge-sol":p.currency==="USD"?"badge-usd":"badge-mix"}`}>
                {p.currency}
              </span>
            </div>
            <div className="platform-currency">{p.currency === "USD" ? "Dólares" : "Soles peruanos"}</div>
            <div className="platform-amount">{formatMoney(p.amount, p.currency)}</div>
            <div className="platform-return">
              {p.returnPct > 0
                ? <span className="up">▲ +{p.returnPct}% YTD</span>
                : <span className="neutral">— Sin rendimiento registrado</span>}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${p.alloc}%`, background: COLORS[i % COLORS.length] }} />
            </div>
          </div>
        ))}
      </div>

      {/* allocation */}
      <div className="two-col">
        <div className="card">
          <div className="section-title">Distribución del portafolio</div>
          <div className="alloc-list">
            {platforms.map((p, i) => (
              <div key={p.id}>
                <div className="alloc-item">
                  <div className="alloc-dot" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="alloc-name">{p.name}</div>
                  <div className="alloc-pct">{p.alloc}%</div>
                </div>
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar" style={{ width: `${p.alloc}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="section-title">Por moneda</div>
          <div style={{marginTop:8}}>
            {[
              { label: "USD", pct: Math.round(platforms.filter(p=>p.currency==="USD").reduce((s,p)=>s+(p.amount/totalUSD)*100,0)), color:"#00d4ff" },
              { label: "PEN", pct: Math.round(platforms.filter(p=>p.currency==="PEN").reduce((s,p)=>s+((p.amount/PEN_USD)/totalUSD)*100,0)), color:"#fbbf24" },
            ].map(c => (
              <div key={c.label} style={{marginBottom:14}}>
                <div className="alloc-item">
                  <div className="alloc-dot" style={{background:c.color}} />
                  <div className="alloc-name">{c.label}</div>
                  <div className="alloc-pct">{c.pct}%</div>
                </div>
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar" style={{width:`${c.pct}%`,background:c.color}} />
                </div>
              </div>
            ))}
            <div style={{marginTop:20, padding:"14px", background:"var(--surface2)", borderRadius:10}}>
              <div style={{fontFamily:"var(--font-mono)", fontSize:"0.7rem", color:"var(--muted)", marginBottom:6}}>TIPO DE CAMBIO REFERENCIAL</div>
              <div style={{fontWeight:700}}>1 USD = S/ {PEN_USD}</div>
              <div style={{fontFamily:"var(--font-mono)", fontSize:"0.72rem", color:"var(--muted)", marginTop:4}}>Actualiza manualmente si cambia</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RadarTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const REFRESH_SECS = 300; // 5 min

  const load = useCallback(async () => {
    setLoading(true);
    setCountdown(REFRESH_SECS);
    try {
      const rec = await fetchRecommendations();
      setData(rec);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => {
      if (c <= 1) { load(); return REFRESH_SECS; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [countdown, load]);

  const badgeClass = tipo => ({
    growth: "badge-growth", value: "badge-value",
    dividend: "badge-dividend", etf: "badge-etf"
  }[tipo] || "badge-solid");

  return (
    <div>
      <div className="radar-header">
        <div>
          <div className="section-title" style={{marginBottom:4}}>
            Radar de Inversiones <span>perfil moderado · actualización IA</span>
          </div>
          {data && <div style={{fontFamily:"var(--font-mono)", fontSize:"0.78rem", color:"var(--muted)"}}>
            {data.resumen_mercado}
          </div>}
        </div>
        <div style={{display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6}}>
          <button className="refresh-btn" onClick={load} disabled={loading}>
            <span className={loading ? "spin" : ""}>⟳</span>
            {loading ? "Analizando..." : "Actualizar ahora"}
          </button>
          {!loading && <span className="countdown">Auto-refresh en {Math.floor(countdown/60)}:{String(countdown%60).padStart(2,"0")}</span>}
        </div>
      </div>

      <div className="recs-grid">
        {loading && (
          <div className="loading-box">
            <div style={{fontSize:"2rem"}}>📡</div>
            <p>Analizando mercados con IA...<br/>Esto tarda unos segundos.</p>
          </div>
        )}
        {!loading && data?.acciones?.map((a, i) => (
          <div key={i} className="rec-card">
            <div className="rec-top">
              <div>
                <div className="rec-ticker">{a.ticker}</div>
                <div className="rec-name">{a.nombre}</div>
              </div>
              <div className="rec-badges">
                <span className={`badge ${badgeClass(a.tipo)}`}>{a.tipo?.toUpperCase()}</span>
                <span className="badge badge-solid">{a.rol}</span>
              </div>
            </div>
            <div className="rec-price">Precio actual: {a.precio_actual}</div>
            <div className="rec-target">
              <span className="rec-target-label">Objetivo 12m</span>
              <span className="rec-target-val up">{a.precio_objetivo} <span className="up">({a.potencial})</span></span>
            </div>
            <div className="rec-thesis">{a.tesis}</div>
            <div className="score-bar">
              <span className="score-label">Confianza</span>
              <div className="score-track">
                <div className="score-fill" style={{width:`${a.score}%`}} />
              </div>
              <span className="score-num">{a.score}/100</span>
            </div>
          </div>
        ))}
      </div>

      <div className="disclaimer">
        ⚠️ Este análisis es generado por IA con fines informativos y educativos. No constituye asesoramiento financiero profesional. Siempre realiza tu propia investigación antes de invertir.
      </div>
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [platforms, setPlatforms] = useState(DEFAULT_PLATFORMS);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <header className="header">
          <div>
            <div className="logo">mi<span>Capital</span></div>
            <div className="tagline">panel de inversiones · perfil moderado</div>
          </div>
          <div className="last-update">
            <span className="pulse" />
            {now.toLocaleDateString("es-PE", { weekday:"short", day:"numeric", month:"short" })} · {now.toLocaleTimeString("es-PE", { hour:"2-digit", minute:"2-digit" })}
          </div>
        </header>

        <div className="tabs">
          {[["dashboard","📊  Mi Portafolio"],["radar","📡  Radar de Acciones"]].map(([key,label]) => (
            <div key={key} className={`tab ${tab===key?"active":""}`} onClick={() => setTab(key)}>{label}</div>
          ))}
        </div>

        <div className="main">
          {tab === "dashboard"
            ? <DashboardTab platforms={platforms} setPlatforms={setPlatforms} />
            : <RadarTab />}
        </div>
      </div>
    </>
  );
}
