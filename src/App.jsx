import { useState, useEffect, useRef, useMemo } from "react";

// ─── DATA & CONSTANTS ───────────────────────────────────────────────────────
const COLORS = {
  bg: "#0B0E14",
  surface: "#121720",
  surfaceHover: "#181D28",
  card: "#151A24",
  cardAlt: "#1A2030",
  border: "#1E2536",
  borderLight: "#2A3348",
  accent: "#3B82F6",
  accentGlow: "rgba(59,130,246,0.15)",
  accentSoft: "rgba(59,130,246,0.08)",
  green: "#10B981",
  greenSoft: "rgba(16,185,129,0.12)",
  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.12)",
  amber: "#F59E0B",
  amberSoft: "rgba(245,158,11,0.12)",
  text: "#E2E8F0",
  textMuted: "#8B95A8",
  textDim: "#5A6478",
};

const PROP_FIRMS = [
  { id: 1, name: "FTMO", maxFunding: "200K", fee: "$155–$1,080", profit: "80%", targets: "10% / 5%", maxDD: "10%", dailyDD: "5%", platforms: "MT4, MT5, cTrader", payouts: "Bi-weekly", rating: 4.7, popular: true },
  { id: 2, name: "The Funded Trader", maxFunding: "600K", fee: "$65–$1,089", profit: "90%", targets: "8% / 5%", maxDD: "12%", dailyDD: "5%", platforms: "MT4, MT5", payouts: "Bi-weekly", rating: 4.3, popular: true },
  { id: 3, name: "Topstep", maxFunding: "150K", fee: "$49–$149/mo", profit: "90%", targets: "6%", maxDD: "Trailing", dailyDD: "None", platforms: "NinjaTrader, Tradovate", payouts: "Weekly", rating: 4.5, popular: false },
  { id: 4, name: "MyFundedFX", maxFunding: "300K", fee: "$49–$549", profit: "80%", targets: "8% / 5%", maxDD: "8%", dailyDD: "5%", platforms: "MT4, MT5", payouts: "Bi-weekly", rating: 4.1, popular: false },
  { id: 5, name: "E8 Funding", maxFunding: "400K", fee: "$228–$988", profit: "80%", targets: "8%", maxDD: "8%", dailyDD: "None", platforms: "MT4, MT5", payouts: "Bi-weekly", rating: 4.2, popular: false },
  { id: 6, name: "Surge Trading", maxFunding: "1M", fee: "$250–$6,500", profit: "75%", targets: "10% / 5%", maxDD: "8%", dailyDD: "4%", platforms: "MT4, MT5, TradingView", payouts: "Monthly", rating: 4.0, popular: false },
];

const BROKERS = [
  { id: 1, name: "IC Markets", type: "ECN", spreads: "0.0 pips", commission: "$3.50/lot", platforms: "MT4, MT5, cTrader", regulation: "ASIC, CySEC", minDeposit: "$200", leverage: "1:500", rating: 4.8 },
  { id: 2, name: "Pepperstone", type: "ECN", spreads: "0.0 pips", commission: "$3.50/lot", platforms: "MT4, MT5, cTrader", regulation: "ASIC, FCA", minDeposit: "$200", leverage: "1:500", rating: 4.7 },
  { id: 3, name: "Exness", type: "Market Maker", spreads: "0.3 pips", commission: "None", platforms: "MT4, MT5", regulation: "FCA, CySEC", minDeposit: "$1", leverage: "1:Unlimited", rating: 4.5 },
  { id: 4, name: "XM", type: "Market Maker", spreads: "0.6 pips", commission: "None", platforms: "MT4, MT5", regulation: "CySEC, ASIC", minDeposit: "$5", leverage: "1:888", rating: 4.3 },
];

const SAMPLE_TRADES = [
  { id: 1, date: "2025-02-10", pair: "EURUSD", type: "BUY", entry: 1.0785, exit: 1.0832, sl: 1.0755, lots: 1.0, pnl: 470, rr: 1.57, duration: "2h 15m", tag: "trend" },
  { id: 2, date: "2025-02-10", pair: "GBPJPY", type: "SELL", entry: 189.45, exit: 189.82, sl: 189.15, lots: 0.5, pnl: -185, rr: -1.23, duration: "45m", tag: "revenge" },
  { id: 3, date: "2025-02-11", pair: "USDJPY", type: "BUY", entry: 151.20, exit: 151.85, sl: 150.90, lots: 0.8, pnl: 520, rr: 2.17, duration: "4h 30m", tag: "trend" },
  { id: 4, date: "2025-02-11", pair: "EURUSD", type: "SELL", entry: 1.0810, exit: 1.0790, sl: 1.0830, lots: 1.2, pnl: 240, rr: 1.0, duration: "1h 10m", tag: "scalp" },
  { id: 5, date: "2025-02-12", pair: "XAUUSD", type: "BUY", entry: 2015.50, exit: 2028.30, sl: 2008.00, lots: 0.3, pnl: 384, rr: 1.71, duration: "6h", tag: "swing" },
  { id: 6, date: "2025-02-12", pair: "GBPUSD", type: "SELL", entry: 1.2580, exit: 1.2610, sl: 1.2555, lots: 0.7, pnl: -210, rr: -1.2, duration: "30m", tag: "revenge" },
  { id: 7, date: "2025-02-13", pair: "EURUSD", type: "BUY", entry: 1.0765, exit: 1.0810, sl: 1.0740, lots: 1.0, pnl: 450, rr: 1.8, duration: "3h", tag: "trend" },
  { id: 8, date: "2025-02-13", pair: "USDJPY", type: "SELL", entry: 152.10, exit: 151.75, sl: 152.35, lots: 0.5, pnl: 175, rr: 1.4, duration: "2h", tag: "scalp" },
  { id: 9, date: "2025-02-14", pair: "XAUUSD", type: "SELL", entry: 2030.00, exit: 2035.50, sl: 2025.00, lots: 0.2, pnl: -110, rr: -1.1, duration: "1h", tag: "overtrade" },
  { id: 10, date: "2025-02-14", pair: "EURUSD", type: "BUY", entry: 1.0800, exit: 1.0855, sl: 1.0770, lots: 0.8, pnl: 440, rr: 1.83, duration: "5h", tag: "swing" },
];

const LEADERBOARD = [
  { rank: 1, name: "AlphaTrader_", country: "🇬🇧", winRate: 72.5, profitFactor: 2.81, drawdown: 4.2, score: 94, style: "Swing", streak: 12 },
  { rank: 2, name: "FX_Samurai", country: "🇯🇵", winRate: 68.3, profitFactor: 2.45, drawdown: 5.1, score: 91, style: "Scalp", streak: 8 },
  { rank: 3, name: "NicoTradesEU", country: "🇩🇪", winRate: 65.0, profitFactor: 2.12, drawdown: 6.8, score: 87, style: "Day", streak: 5 },
  { rank: 4, name: "TradingWombat", country: "🇦🇺", winRate: 61.8, profitFactor: 1.98, drawdown: 7.2, score: 84, style: "Swing", streak: 6 },
  { rank: 5, name: "ZenPips", country: "🇨🇦", winRate: 70.1, profitFactor: 1.85, drawdown: 8.0, score: 82, style: "Position", streak: 4 },
  { rank: 6, name: "MarketMonk", country: "🇺🇸", winRate: 58.5, profitFactor: 1.72, drawdown: 9.1, score: 79, style: "Day", streak: 3 },
  { rank: 7, name: "PixelTrader", country: "🇳🇬", winRate: 63.2, profitFactor: 1.65, drawdown: 7.5, score: 77, style: "Scalp", streak: 7 },
  { rank: 8, name: "TheChartWhisperer", country: "🇿🇦", winRate: 55.0, profitFactor: 1.90, drawdown: 6.0, score: 75, style: "Swing", streak: 2 },
];

const MARKET_SIGNALS = [
  { pair: "EURUSD", direction: "BUY", confidence: 78, entry: "1.0790", tp: "1.0850", sl: "1.0755", basis: "Bullish divergence on H4 RSI, price holding above 200 EMA" },
  { pair: "GBPJPY", direction: "SELL", confidence: 65, entry: "189.20", tp: "188.40", sl: "189.70", basis: "Bearish engulfing at resistance, overbought RSI" },
  { pair: "XAUUSD", direction: "BUY", confidence: 82, entry: "2025.00", tp: "2055.00", sl: "2010.00", basis: "Safe-haven flows on geopolitical tension, breakout retest" },
];

const ARTICLES = [
  { id: 1, category: "Macro", title: "Fed Holds Rates Steady — Markets Await March Guidance", date: "Feb 14, 2025", readTime: "4 min", excerpt: "The FOMC kept rates at 4.25–4.50% with a hawkish tilt. Here's what it means for FX." },
  { id: 2, category: "Education", title: "Risk of Ruin: The Metric Every Trader Ignores", date: "Feb 13, 2025", readTime: "6 min", excerpt: "Why understanding your risk of ruin percentage is more important than win rate." },
  { id: 3, category: "Signals", title: "Weekly Watchlist: 3 High-Probability Setups", date: "Feb 12, 2025", readTime: "3 min", excerpt: "EURUSD, XAUUSD, and USDJPY — here's what we're watching this week." },
  { id: 4, category: "Commentary", title: "Why Most Funded Traders Fail in Month 2", date: "Feb 11, 2025", readTime: "5 min", excerpt: "Data from 10,000 prop firm accounts reveals the #1 reason traders lose funding." },
];

// ─── UTILITY COMPONENTS ──────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    market: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
    building: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    arrowUp: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
    arrowDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 0 1 5 5c0 .74-.16 1.43-.45 2.06A5 5 0 0 1 20 14a5 5 0 0 1-4.78 5H8.78A5 5 0 0 1 4 14a5 5 0 0 1 3.45-4.94A5.03 5.03 0 0 1 7 7a5 5 0 0 1 5-5z"/><path d="M12 2v20"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    compare: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="8" height="18" rx="1"/><rect x="14" y="3" width="8" height="18" rx="1"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  };
  return icons[name] || null;
};

const Badge = ({ children, color = COLORS.accent }) => (
  <span style={{
    padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
    background: color + "18", color: color, letterSpacing: "0.03em",
  }}>{children}</span>
);

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10,
    padding: "16px 18px", flex: 1, minWidth: 140, position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 12, right: 14, opacity: 0.12, color }}><Icon name={icon} size={32} /></div>
    <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: color || COLORS.text, fontFamily: "'DM Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>{sub}</div>}
  </div>
);

const SentimentBar = ({ label, value, color }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 13, color: COLORS.text }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: "'DM Mono', monospace" }}>{value}%</span>
    </div>
    <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
    </div>
  </div>
);

const MiniChart = ({ data, color, width = 120, height = 36 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
};

// ─── EQUITY CURVE ─────────────────────────────────────────────────────────────
const EquityCurve = ({ trades }) => {
  const width = 460;
  const height = 140;
  const pad = { t: 10, r: 10, b: 20, l: 50 };
  const cumPnl = trades.reduce((acc, t) => [...acc, (acc[acc.length - 1] || 10000) + t.pnl], [10000]);
  const min = Math.min(...cumPnl);
  const max = Math.max(...cumPnl);
  const range = max - min || 1;
  const xScale = (i) => pad.l + (i / (cumPnl.length - 1)) * (width - pad.l - pad.r);
  const yScale = (v) => pad.t + (1 - (v - min) / range) * (height - pad.t - pad.b);
  const path = cumPnl.map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(v)}`).join(" ");
  const areaPath = path + ` L${xScale(cumPnl.length - 1)},${height - pad.b} L${pad.l},${height - pad.b} Z`;
  const finalVal = cumPnl[cumPnl.length - 1];
  const color = finalVal >= 10000 ? COLORS.green : COLORS.red;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[min, min + range / 2, max].map((v, i) => (
        <g key={i}>
          <line x1={pad.l} y1={yScale(v)} x2={width - pad.r} y2={yScale(v)} stroke={COLORS.border} strokeDasharray="3,3" />
          <text x={pad.l - 6} y={yScale(v) + 4} textAnchor="end" fill={COLORS.textDim} fontSize="10" fontFamily="'DM Mono', monospace">${(v / 1000).toFixed(1)}k</text>
        </g>
      ))}
      <path d={areaPath} fill="url(#eqGrad)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      {cumPnl.map((v, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(v)} r="3" fill={COLORS.bg} stroke={color} strokeWidth="1.5" />
      ))}
    </svg>
  );
};

// ─── RISK GAUGE ──────────────────────────────────────────────────────────────
const RiskGauge = ({ score, label }) => {
  const color = score >= 75 ? COLORS.green : score >= 50 ? COLORS.amber : COLORS.red;
  const angle = -135 + (score / 100) * 270;
  const r = 42;
  const cx = 50;
  const cy = 50;
  const endX = cx + r * Math.cos((angle * Math.PI) / 180);
  const endY = cy + r * Math.sin((angle * Math.PI) / 180);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="100" height="80" viewBox="0 0 100 80">
        <path d="M 12 62 A 42 42 0 1 1 88 62" fill="none" stroke={COLORS.border} strokeWidth="6" strokeLinecap="round" />
        <path d="M 12 62 A 42 42 0 1 1 88 62" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 230} 230`} style={{ transition: "stroke-dasharray 1s ease" }} />
        <circle cx={endX} cy={endY} r="4" fill={color} />
        <text x="50" y="52" textAnchor="middle" fill={COLORS.text} fontSize="18" fontWeight="700" fontFamily="'DM Mono', monospace">{score}</text>
        <text x="50" y="66" textAnchor="middle" fill={COLORS.textDim} fontSize="9" fontFamily="'DM Mono', monospace">/100</text>
      </svg>
      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: -4 }}>{label}</div>
    </div>
  );
};

// ─── PAGES ──────────────────────────────────────────────────────────────────

// HOME DASHBOARD
const HomePage = () => {
  const totalPnl = SAMPLE_TRADES.reduce((s, t) => s + t.pnl, 0);
  const winRate = ((SAMPLE_TRADES.filter(t => t.pnl > 0).length / SAMPLE_TRADES.length) * 100).toFixed(1);
  const avgRR = (SAMPLE_TRADES.reduce((s, t) => s + Math.abs(t.rr), 0) / SAMPLE_TRADES.length).toFixed(2);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
          Welcome back, Trader
        </h2>
        <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "4px 0 0" }}>Here's your portfolio at a glance</p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard label="Balance" value="$12,174" sub="+$2,174 all time" color={COLORS.green} icon="chart" />
        <StatCard label="Week P&L" value={`$${totalPnl.toLocaleString()}`} color={totalPnl >= 0 ? COLORS.green : COLORS.red} icon="zap" />
        <StatCard label="Win Rate" value={`${winRate}%`} color={COLORS.accent} icon="trophy" />
        <StatCard label="Avg R:R" value={avgRR} color={COLORS.amber} icon="brain" />
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ flex: 2, minWidth: 280, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>Equity Curve</div>
          <EquityCurve trades={SAMPLE_TRADES} />
        </div>
        <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <RiskGauge score={76} label="Smart Score" />
              <RiskGauge score={62} label="Risk Score" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Coach Card */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.accent}12, ${COLORS.card})`,
        border: `1px solid ${COLORS.accent}30`, borderRadius: 10, padding: 18, marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ background: COLORS.accent, borderRadius: 6, padding: 5, display: "flex" }}><Icon name="brain" size={14} /></div>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, letterSpacing: "0.04em", textTransform: "uppercase" }}>AI Advisory Coach</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "Your average loss is 2× your average win — tighten stops or widen targets.",
            "2 revenge trades detected this week. Step away after a loss > 1R.",
            "EURUSD is your best performer (83% WR). Consider focusing there.",
          ].map((tip, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: COLORS.text, lineHeight: 1.5,
            }}>
              <span style={{ color: COLORS.amber, marginTop: 2, flexShrink: 0 }}><Icon name="zap" size={13} /></span>
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Market Sentiment */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>Market Sentiment</div>
        <SentimentBar label="EURUSD" value={68} color={COLORS.green} />
        <SentimentBar label="GBPJPY" value={35} color={COLORS.red} />
        <SentimentBar label="XAUUSD" value={82} color={COLORS.green} />
        <SentimentBar label="USDJPY" value={51} color={COLORS.amber} />
      </div>
    </div>
  );
};

// MARKET INTELLIGENCE
const MarketPage = () => {
  const [tab, setTab] = useState("signals");
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px", fontFamily: "'Space Grotesk', sans-serif" }}>Market Intelligence</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 20px" }}>Research, signals & macro insights</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["signals", "articles", "calendar"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? COLORS.accent : COLORS.surface, color: tab === t ? "#fff" : COLORS.textMuted,
            transition: "all 0.2s",
          }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "signals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MARKET_SIGNALS.map((s, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{s.pair}</span>
                  <Badge color={s.direction === "BUY" ? COLORS.green : COLORS.red}>{s.direction}</Badge>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 36, height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden",
                  }}>
                    <div style={{ width: `${s.confidence}%`, height: "100%", background: s.confidence >= 75 ? COLORS.green : COLORS.amber, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'DM Mono', monospace" }}>{s.confidence}%</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, marginBottom: 8 }}>
                {[["Entry", s.entry], ["TP", s.tp], ["SL", s.sl]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{s.basis}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "articles" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ARTICLES.map(a => (
            <div key={a.id} style={{
              background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16,
              cursor: "pointer", transition: "border-color 0.2s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <Badge>{a.category}</Badge>
                <span style={{ fontSize: 11, color: COLORS.textDim }}>{a.date} · {a.readTime}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{a.excerpt}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "calendar" && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 14, letterSpacing: "0.04em" }}>UPCOMING EVENTS</div>
          {[
            { time: "08:30 EST", event: "US CPI (YoY)", impact: "High", forecast: "2.9%", prev: "2.9%" },
            { time: "10:00 EST", event: "Michigan Consumer Sentiment", impact: "Med", forecast: "71.1", prev: "71.1" },
            { time: "13:00 EST", event: "FOMC Member Speaks", impact: "High", forecast: "—", prev: "—" },
            { time: "19:30 EST", event: "AU Employment Change", impact: "Med", forecast: "25.0K", prev: "56.3K" },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none" }}>
              <span style={{ fontSize: 12, color: COLORS.textDim, fontFamily: "'DM Mono', monospace", minWidth: 80 }}>{e.time}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{e.event}</div>
              </div>
              <Badge color={e.impact === "High" ? COLORS.red : COLORS.amber}>{e.impact}</Badge>
              <div style={{ textAlign: "right", minWidth: 60 }}>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>Forecast</div>
                <div style={{ fontSize: 12, color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{e.forecast}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ANALYTICS MODULE
const AnalyticsPage = () => {
  const [tab, setTab] = useState("performance");
  const [showUpload, setShowUpload] = useState(false);
  const wins = SAMPLE_TRADES.filter(t => t.pnl > 0);
  const losses = SAMPLE_TRADES.filter(t => t.pnl < 0);
  const totalPnl = SAMPLE_TRADES.reduce((s, t) => s + t.pnl, 0);
  const avgWin = wins.reduce((s, t) => s + t.pnl, 0) / wins.length;
  const avgLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length);
  const profitFactor = (wins.reduce((s, t) => s + t.pnl, 0) / Math.abs(losses.reduce((s, t) => s + t.pnl, 0))).toFixed(2);
  const maxDD = "6.8%";
  const riskOfRuin = "8.2%";

  const pairStats = {};
  SAMPLE_TRADES.forEach(t => {
    if (!pairStats[t.pair]) pairStats[t.pair] = { wins: 0, total: 0, pnl: 0 };
    pairStats[t.pair].total++;
    if (t.pnl > 0) pairStats[t.pair].wins++;
    pairStats[t.pair].pnl += t.pnl;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Trader Analytics</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "4px 0 0" }}>Performance, risk & behaviour analysis</p>
        </div>
        <button onClick={() => setShowUpload(!showUpload)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 7,
          background: COLORS.accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          <Icon name="upload" size={14} /> Import Trades
        </button>
      </div>

      {showUpload && (
        <div style={{
          background: COLORS.card, border: `1px dashed ${COLORS.accent}40`, borderRadius: 10, padding: 28,
          textAlign: "center", marginBottom: 20, cursor: "pointer",
        }}>
          <Icon name="upload" size={32} />
          <div style={{ fontSize: 14, color: COLORS.text, marginTop: 10, fontWeight: 600 }}>Drop CSV file or click to upload</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Format: Date, Pair, Type, Entry, Exit, SL, Lots, P&L</div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
            <button style={{ padding: "6px 14px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 12, cursor: "pointer" }}>Download Template</button>
            <button style={{ padding: "6px 14px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: COLORS.surface, color: COLORS.text, fontSize: 12, cursor: "pointer" }}>Manual Entry</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["performance", "risk", "behaviour", "history"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t ? COLORS.accent : COLORS.surface, color: tab === t ? "#fff" : COLORS.textMuted,
          }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "performance" && (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <StatCard label="Total P&L" value={`$${totalPnl.toLocaleString()}`} color={COLORS.green} icon="chart" />
            <StatCard label="Profit Factor" value={profitFactor} color={parseFloat(profitFactor) >= 1.5 ? COLORS.green : COLORS.amber} icon="zap" />
            <StatCard label="Avg Win" value={`$${avgWin.toFixed(0)}`} color={COLORS.green} icon="arrowUp" />
            <StatCard label="Avg Loss" value={`$${avgLoss.toFixed(0)}`} color={COLORS.red} icon="arrowDown" />
          </div>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18, marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" }}>Equity Curve</div>
            <EquityCurve trades={SAMPLE_TRADES} />
          </div>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>Performance by Pair</div>
            {Object.entries(pairStats).map(([pair, s]) => (
              <div key={pair} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Mono', monospace", minWidth: 70 }}>{pair}</span>
                <div style={{ flex: 1, height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(s.wins / s.total) * 100}%`, height: "100%", background: COLORS.green, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, color: COLORS.textMuted, minWidth: 40, textAlign: "right" }}>{((s.wins / s.total) * 100).toFixed(0)}% WR</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.pnl >= 0 ? COLORS.green : COLORS.red, fontFamily: "'DM Mono', monospace", minWidth: 60, textAlign: "right" }}>${s.pnl >= 0 ? "+" : ""}{s.pnl}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "risk" && (
        <>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
            <StatCard label="Max Drawdown" value={maxDD} color={COLORS.amber} icon="arrowDown" />
            <StatCard label="Risk of Ruin" value={riskOfRuin} color={COLORS.green} icon="brain" />
            <StatCard label="Sharpe Ratio" value="1.42" color={COLORS.accent} icon="chart" />
            <StatCard label="Avg Exposure" value="2.1%" color={COLORS.green} icon="zap" />
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18, textAlign: "center" }}>
              <RiskGauge score={62} label="Overall Risk Score" />
              <div style={{ marginTop: 12, fontSize: 12, color: COLORS.green, fontWeight: 600 }}>LOW-MEDIUM RISK</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>You're managing risk better than 68% of traders</div>
            </div>
            <div style={{ flex: 2, minWidth: 280, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 14, letterSpacing: "0.04em", textTransform: "uppercase" }}>Risk Breakdown</div>
              <SentimentBar label="Position Sizing" value={78} color={COLORS.green} />
              <SentimentBar label="Stop Loss Discipline" value={55} color={COLORS.amber} />
              <SentimentBar label="Drawdown Control" value={72} color={COLORS.green} />
              <SentimentBar label="Overexposure" value={85} color={COLORS.green} />
            </div>
          </div>
        </>
      )}

      {tab === "behaviour" && (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
            <div style={{ flex: 1, minWidth: 200, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18, textAlign: "center" }}>
              <RiskGauge score={58} label="Behaviour Score" />
              <div style={{ marginTop: 12, fontSize: 12, color: COLORS.amber, fontWeight: 600 }}>NEEDS IMPROVEMENT</div>
            </div>
            <div style={{ flex: 2, minWidth: 280, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Overtrading", count: 1, severity: "Low", color: COLORS.green, desc: "1 session with >5 trades in 2 hours" },
                { label: "Revenge Trading", count: 2, severity: "High", color: COLORS.red, desc: "Entered trades within 10min of a loss" },
                { label: "Moving Stop Loss", count: 0, severity: "None", color: COLORS.green, desc: "No detected SL modifications" },
                { label: "FOMO Entry", count: 1, severity: "Med", color: COLORS.amber, desc: "1 entry at extended price without pullback" },
              ].map((b, i) => (
                <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{b.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{b.desc}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Badge color={b.color}>{b.severity}</Badge>
                    <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>{b.count} occurrences</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "history" && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["Date", "Pair", "Type", "Entry", "Exit", "P&L", "R:R", "Tag"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: COLORS.textDim, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_TRADES.map(t => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "10px 12px", color: COLORS.textMuted, fontFamily: "'DM Mono', monospace" }}>{t.date}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{t.pair}</td>
                    <td style={{ padding: "10px 12px" }}><Badge color={t.type === "BUY" ? COLORS.green : COLORS.red}>{t.type}</Badge></td>
                    <td style={{ padding: "10px 12px", color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{t.entry}</td>
                    <td style={{ padding: "10px 12px", color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{t.exit}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, fontFamily: "'DM Mono', monospace", color: t.pnl >= 0 ? COLORS.green : COLORS.red }}>{t.pnl >= 0 ? "+" : ""}{t.pnl}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "'DM Mono', monospace", color: t.rr >= 0 ? COLORS.green : COLORS.red }}>{t.rr.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px" }}><Badge color={t.tag === "revenge" || t.tag === "overtrade" ? COLORS.red : COLORS.textMuted}>{t.tag}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// LEADERBOARD
const LeaderboardPage = () => {
  const [filter, setFilter] = useState("all");
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px", fontFamily: "'Space Grotesk', sans-serif" }}>Leaderboard</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 20px" }}>Top traders ranked by Smart Score</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {["all", "swing", "scalp", "day", "low-risk"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
            background: filter === f ? COLORS.accent : COLORS.surface, color: filter === f ? "#fff" : COLORS.textMuted,
          }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LEADERBOARD.filter(t => filter === "all" || filter === "low-risk" ? true : t.style.toLowerCase() === filter).map((t, i) => (
          <div key={t.rank} style={{
            background: t.rank <= 3 ? `linear-gradient(135deg, ${COLORS.card}, ${[COLORS.amber, COLORS.textDim, "#CD7F32"][t.rank - 1]}08)` : COLORS.card,
            border: `1px solid ${t.rank <= 3 ? [COLORS.amber, COLORS.textDim, "#CD7F32"][t.rank - 1] + "30" : COLORS.border}`,
            borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono', monospace",
              background: t.rank <= 3 ? [COLORS.amber, "#94A3B8", "#CD7F32"][t.rank - 1] + "20" : COLORS.surface,
              color: t.rank <= 3 ? [COLORS.amber, "#94A3B8", "#CD7F32"][t.rank - 1] : COLORS.textDim,
            }}>#{t.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{t.country} {t.name}</span>
                <Badge>{t.style}</Badge>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>WR: <span style={{ color: COLORS.text, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{t.winRate}%</span></span>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>PF: <span style={{ color: COLORS.text, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{t.profitFactor}</span></span>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>DD: <span style={{ color: COLORS.text, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{t.drawdown}%</span></span>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>Streak: <span style={{ color: COLORS.green, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{t.streak}W</span></span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                color: t.score >= 90 ? COLORS.green : t.score >= 80 ? COLORS.accent : COLORS.amber,
              }}>{t.score}</div>
              <div style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: "0.05em" }}>SCORE</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// BROKER & PROP FIRM HUB
const BrokerPage = () => {
  const [view, setView] = useState("propfirms");
  const [comparing, setComparing] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (id) => {
    setComparing(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev);
  };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px", fontFamily: "'Space Grotesk', sans-serif" }}>Broker & Prop Firm Hub</h2>
      <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 20px" }}>Find the right firm for your trading style</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["propfirms", "brokers", "match"].map(t => (
            <button key={t} onClick={() => { setView(t); setShowCompare(false); }} style={{
              padding: "7px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: view === t ? COLORS.accent : COLORS.surface, color: view === t ? "#fff" : COLORS.textMuted,
            }}>{t === "propfirms" ? "Prop Firms" : t === "brokers" ? "Brokers" : "Smart Match"}</button>
          ))}
        </div>
        {comparing.length === 2 && !showCompare && (
          <button onClick={() => setShowCompare(true)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6,
            background: COLORS.accent, border: "none", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>
            <Icon name="compare" size={14} /> Compare ({comparing.length})
          </button>
        )}
      </div>

      {showCompare && comparing.length === 2 && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}30`, borderRadius: 10, padding: 18, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>Comparison</span>
            <button onClick={() => { setShowCompare(false); setComparing([]); }} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 12 }}>✕ Close</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <th style={{ padding: 10, textAlign: "left", color: COLORS.textDim, fontSize: 11 }}>FEATURE</th>
                  {comparing.map(id => {
                    const f = PROP_FIRMS.find(f => f.id === id);
                    return <th key={id} style={{ padding: 10, textAlign: "center", color: COLORS.text, fontSize: 14, fontWeight: 700 }}>{f?.name}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {["maxFunding", "fee", "profit", "targets", "maxDD", "dailyDD", "platforms", "payouts", "rating"].map(key => (
                  <tr key={key} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: 10, color: COLORS.textMuted, fontSize: 12, textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, " $1")}</td>
                    {comparing.map(id => {
                      const f = PROP_FIRMS.find(f => f.id === id);
                      return <td key={id} style={{ padding: 10, textAlign: "center", color: COLORS.text, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{f?.[key]}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === "propfirms" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PROP_FIRMS.map(f => (
            <div key={f.id} style={{
              background: comparing.includes(f.id) ? COLORS.accentSoft : COLORS.card,
              border: `1px solid ${comparing.includes(f.id) ? COLORS.accent + "40" : COLORS.border}`,
              borderRadius: 10, padding: 16, cursor: "pointer", transition: "all 0.2s",
            }} onClick={() => toggleCompare(f.id)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{f.name}</span>
                  {f.popular && <Badge color={COLORS.green}>Popular</Badge>}
                  {comparing.includes(f.id) && <Badge color={COLORS.accent}>Selected</Badge>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="star" size={12} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber, fontFamily: "'DM Mono', monospace" }}>{f.rating}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {[["Max Funding", f.maxFunding], ["Fee", f.fee], ["Profit Split", f.profit], ["Max DD", f.maxDD], ["Platforms", f.platforms]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: COLORS.textDim, textAlign: "center", marginTop: 8 }}>Tap any 2 firms to compare them side by side</div>
        </div>
      )}

      {view === "brokers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {BROKERS.map(b => (
            <div key={b.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>{b.name}</span>
                  <Badge>{b.type}</Badge>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="star" size={12} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber, fontFamily: "'DM Mono', monospace" }}>{b.rating}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {[["Spreads", b.spreads], ["Commission", b.commission], ["Min Deposit", b.minDeposit], ["Leverage", b.leverage], ["Regulation", b.regulation]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "match" && (
        <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}12, ${COLORS.card})`, border: `1px solid ${COLORS.accent}30`, borderRadius: 10, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ background: COLORS.accent, borderRadius: 6, padding: 5, display: "flex" }}><Icon name="brain" size={14} /></div>
            <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.accent }}>Smart Match Engine</span>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
            Based on your trading style (Swing, EURUSD focus, 70% WR, 6.8% max DD), we recommend:
          </div>
          {[
            { name: "FTMO", match: 94, reason: "Best match for swing traders with solid risk management. Low DD limit suits your style." },
            { name: "The Funded Trader", match: 87, reason: "Higher funding ceiling and generous profit split. Good if you want to scale." },
            { name: "E8 Funding", match: 78, reason: "No daily drawdown limit gives you more flexibility during volatile sessions." },
          ].map((m, i) => (
            <div key={i} style={{
              background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14, marginBottom: 10,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{m.name}</span>
                  {i === 0 && <Badge color={COLORS.green}>Best Match</Badge>}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{m.reason}</div>
              </div>
              <div style={{ textAlign: "center", minWidth: 60, marginLeft: 16 }}>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: m.match >= 90 ? COLORS.green : COLORS.accent }}>{m.match}%</div>
                <div style={{ fontSize: 10, color: COLORS.textDim }}>MATCH</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nav = [
    { id: "home", label: "Dashboard", icon: "home" },
    { id: "market", label: "Market", icon: "market" },
    { id: "analytics", label: "Analytics", icon: "chart" },
    { id: "leaderboard", label: "Rankings", icon: "trophy" },
    { id: "broker", label: "Hub", icon: "building" },
  ];

  const pages = { home: HomePage, market: MarketPage, analytics: AnalyticsPage, leaderboard: LeaderboardPage, broker: BrokerPage };
  const PageComponent = pages[page];

  return (
    <div style={{
      fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      background: COLORS.bg, color: COLORS.text, minHeight: "100vh", display: "flex", flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* TOP BAR */}
      <header style={{
        background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
        padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg, ${COLORS.accent}, #8B5CF6)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="zap" size={15} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>TradeForge</span>
          <Badge color={COLORS.amber}>POC</Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.card, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="bell" size={15} />
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.accent}40, ${COLORS.accent}20)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="user" size={15} />
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDE NAV (desktop) */}
        {!isMobile && (
          <nav style={{
            width: 72, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`,
            display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 4,
          }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                width: 56, height: 52, borderRadius: 10, border: "none", cursor: "pointer",
                background: page === n.id ? COLORS.accentGlow : "transparent",
                color: page === n.id ? COLORS.accent : COLORS.textDim,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                transition: "all 0.2s",
              }}>
                <Icon name={n.icon} size={20} />
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.03em" }}>{n.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* MAIN CONTENT */}
        <main style={{
          flex: 1, overflow: "auto", padding: isMobile ? "16px 14px 80px" : "24px 28px",
          maxWidth: 900, margin: isMobile ? 0 : undefined,
        }}>
          <PageComponent />
        </main>
      </div>

      {/* BOTTOM NAV (mobile) */}
      {isMobile && (
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.surface,
          borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-around",
          padding: "8px 0 env(safe-area-inset-bottom, 8px)", zIndex: 100, backdropFilter: "blur(12px)",
        }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              flex: 1, height: 48, border: "none", cursor: "pointer",
              background: "transparent", color: page === n.id ? COLORS.accent : COLORS.textDim,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
            }}>
              <Icon name={n.icon} size={20} />
              <span style={{ fontSize: 9, fontWeight: 600 }}>{n.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
