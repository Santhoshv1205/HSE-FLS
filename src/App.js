/**
 * HSE-FLS Dashboard — React App
 * Human Stress–Environment Feedback Loop System
 * SANTHOSH V | 111722203094 | 22EC979 | R.M.K. Engineering College
 *
 * HOW TO RUN:
 * 1. npx create-react-app hse-fls-dashboard
 * 2. cd hse-fls-dashboard
 * 3. npm install recharts lucide-react
 * 4. Replace src/App.js content with this file
 * 5. npm start
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Activity, Thermometer, Wind, Cpu, Radio,
  Play, Pause, RotateCcw, Zap, ZapOff,
  AlertTriangle, CheckCircle, AlertCircle,
  Monitor, BarChart2, Settings, Info
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const THRESHOLDS = {
  LOW:      { hrv: [70, 89], temp: [31.5, 32.9] },
  MODERATE: { hrv: [40, 69], temp: [33.0, 35.9] },
  HIGH:     { hrv: [30, 39], temp: [36.0, 37.9] },
};

const STRESS_CONFIG = {
  LOW: {
    color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)",
    led: "green", airflow: "LOW", fanSpeed: 1,
    label: "Low Stress", icon: CheckCircle,
    desc: "HRV and temperature within normal range. Minimal airflow. User is comfortable.",
  },
  MODERATE: {
    color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)",
    led: "red", airflow: "MEDIUM", fanSpeed: 2,
    label: "Moderate Stress", icon: AlertCircle,
    desc: "HRV showing variation, temperature slightly elevated. Medium airflow engaged.",
  },
  HIGH: {
    color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)",
    led: "blue", airflow: "HIGH", fanSpeed: 3,
    label: "High Stress", icon: AlertTriangle,
    desc: "Low HRV and elevated temperature. Maximum airflow activated immediately.",
  },
};

const TABS = ["Dashboard", "Charts", "Serial Monitor", "About"];

// ─── SIMULATION ENGINE ────────────────────────────────────────────────────────
function generateReading(forcedLevel = null) {
  const weights = { LOW: 0.30, MODERATE: 0.35, HIGH: 0.35 };
  let level = forcedLevel;
  if (!level) {
    const r = Math.random();
    level = r < 0.30 ? "LOW" : r < 0.65 ? "MODERATE" : "HIGH";
  }
  const t = THRESHOLDS[level];
  const hrv  = Math.floor(Math.random() * (t.hrv[1]  - t.hrv[0]  + 1) + t.hrv[0]);
  const temp = +(Math.random() * (t.temp[1] - t.temp[0]) + t.temp[0]).toFixed(1);
  const pct  = level === "LOW" ? Math.round(15 + Math.random()*20)
             : level === "MODERATE" ? Math.round(45 + Math.random()*20)
             : Math.round(72 + Math.random()*20);
  return { hrv, temp, level, pct, ts: new Date().toLocaleTimeString() };
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function StressHero({ reading, cycle }) {
  const cfg = STRESS_CONFIG[reading.level];
  const Icon = cfg.icon;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (reading.pct / 100) * circumference;

  return (
    <div style={{
      background: "linear-gradient(135deg, #111827, #1a2235)",
      border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: "28px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 24, flexWrap: "wrap",
      boxShadow: `0 0 40px ${cfg.bg}`,
      transition: "all 0.6s ease",
    }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Icon size={22} color={cfg.color} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7a99", letterSpacing: 2, textTransform: "uppercase" }}>
            Current Stress Level
          </span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 52, fontWeight: 700, color: cfg.color, lineHeight: 1, marginBottom: 8 }}>
          {reading.level}
        </div>
        <div style={{ fontSize: 13, color: "#8899bb", lineHeight: 1.6, maxWidth: 380 }}>
          {cfg.desc}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: cfg.color }}>{reading.hrv}</div>
            <div style={{ fontSize: 11, color: "#6b7a99" }}>HRV Index</div>
          </div>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: cfg.color }}>{reading.temp}°C</div>
            <div style={{ fontSize: 11, color: "#6b7a99" }}>Skin Temp</div>
          </div>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: "#818cf8" }}>{cycle}</div>
            <div style={{ fontSize: 11, color: "#6b7a99" }}>Cycles</div>
          </div>
        </div>
      </div>
      {/* Gauge */}
      <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <circle cx="70" cy="70" r="54" fill="none"
            stroke={cfg.color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease, stroke 0.6s ease" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: 30, fontWeight: 700, color: cfg.color, lineHeight: 1 }}>{reading.pct}%</div>
          <div style={{ fontSize: 10, color: "#6b7a99", letterSpacing: 1 }}>STRESS</div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, unit, color, barPct }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: 20,
      transition: "transform 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <Icon size={20} color={color} style={{ marginBottom: 10 }} />
      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#6b7a99", marginBottom: 12 }}>{unit}</div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${barPct}%`, background: color, borderRadius: 2, transition: "width 1s ease, background 0.5s" }} />
      </div>
    </div>
  );
}

function LEDPanel({ level }) {
  const leds = [
    { color: "#22c55e", label: "Green LED", stress: "LOW",      activeColor: "#22c55e" },
    { color: "#ef4444", label: "Red LED",   stress: "MODERATE", activeColor: "#ef4444" },
    { color: "#60a5fa", label: "Blue LED",  stress: "HIGH",     activeColor: "#60a5fa" },
  ];
  return (
    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
        LED Stress Indicators
      </div>
      {leds.map(led => {
        const active = level === led.stress;
        return (
          <div key={led.stress} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: active ? led.activeColor : "rgba(255,255,255,0.05)",
              boxShadow: active ? `0 0 12px ${led.activeColor}, 0 0 24px ${led.activeColor}33` : "none",
              transition: "all 0.5s",
              animation: active ? "ledPulse 1.5s infinite" : "none",
            }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: active ? led.activeColor : "#6b7a99", flex: 1, transition: "color 0.5s" }}>
              {led.label}
            </span>
            <span style={{
              fontFamily: "monospace", fontSize: 10,
              color: active ? led.activeColor : "#374151",
              background: active ? `${led.activeColor}15` : "transparent",
              padding: "2px 8px", borderRadius: 4,
              border: `1px solid ${active ? led.activeColor + "40" : "transparent"}`,
              transition: "all 0.5s",
            }}>
              {active ? "● ON" : "○ OFF"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function AirflowPanel({ level }) {
  const cfg = STRESS_CONFIG[level];
  const speeds = { LOW: 1, MEDIUM: 2, HIGH: 3 };
  const activeBars = { LOW: 2, MODERATE: 3, HIGH: 5 }[level];
  const totalBars = 5;
  const spinDuration = { LOW: "3s", MODERATE: "1.2s", HIGH: "0.4s" }[level];

  return (
    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
        Fan / Airflow Control
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 36, animation: `spin ${spinDuration} linear infinite` }}>🌀</div>
        <div>
          <div style={{ fontSize: 12, color: "#6b7a99" }}>Current Speed</div>
          <div style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 700, color: cfg.color, transition: "color 0.5s" }}>
            {cfg.airflow}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 44, marginBottom: 8 }}>
        {Array.from({ length: totalBars }).map((_, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: "3px 3px 0 0",
            height: `${(i + 1) * 18}%`,
            minHeight: 6,
            background: i < activeBars ? cfg.color : "rgba(255,255,255,0.06)",
            transition: "background 0.6s ease",
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#6b7a99", fontFamily: "monospace" }}>
        {level === "LOW" ? "Minimal ventilation — Low stress" : level === "MODERATE" ? "Medium ventilation — Moderate stress" : "Maximum ventilation — High stress!"}
      </div>
    </div>
  );
}

function ChartsView({ history }) {
  const [chartType, setChartType] = useState("area");
  const tabs = ["area", "bar", "combined"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setChartType(t)} style={{
            padding: "6px 14px", borderRadius: 8,
            fontFamily: "monospace", fontSize: 11, cursor: "pointer",
            background: chartType === t ? "#6366f1" : "transparent",
            border: `1px solid ${chartType === t ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
            color: chartType === t ? "white" : "#6b7a99",
            textTransform: "uppercase", letterSpacing: 1,
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* HRV Chart */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 2, marginBottom: 16 }}>HRV INDEX OVER TIME</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={history} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="ts" stroke="#374151" tick={{ fontSize: 9, fill: "#6b7a99" }} interval="preserveStartEnd" />
            <YAxis stroke="#374151" tick={{ fontSize: 9, fill: "#6b7a99" }} domain={[20, 95]} />
            <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 11 }} labelStyle={{ color: "#6b7a99" }} />
            <Area type="monotone" dataKey="hrv" stroke="#6366f1" strokeWidth={2} fill="url(#hrvGrad)" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
            {/* threshold lines via reference lines */}
            <Line type="monotone" dataKey={() => 70} stroke="#22c55e" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Low threshold (70)" />
            <Line type="monotone" dataKey={() => 40} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" dot={false} name="High threshold (40)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Temperature Chart */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 2, marginBottom: 16 }}>SKIN TEMPERATURE (°C)</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={history} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="ts" stroke="#374151" tick={{ fontSize: 9, fill: "#6b7a99" }} interval="preserveStartEnd" />
            <YAxis stroke="#374151" tick={{ fontSize: 9, fill: "#6b7a99" }} domain={[31, 38]} />
            <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 11 }} />
            <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} fill="url(#tempGrad)" dot={false} activeDot={{ r: 4, fill: "#f59e0b" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stress % Chart */}
      <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 2, marginBottom: 16 }}>STRESS CLASSIFICATION DISTRIBUTION</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={history.slice(-20)} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="ts" stroke="#374151" tick={{ fontSize: 9, fill: "#6b7a99" }} interval="preserveStartEnd" />
            <YAxis stroke="#374151" tick={{ fontSize: 9, fill: "#6b7a99" }} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "monospace", fontSize: 11 }} />
            <Bar dataKey="pct" name="Stress %" radius={[3, 3, 0, 0]}
              fill="#ef4444"
              // colour each bar by level
              label={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SerialMonitor({ logs }) {
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const levelColor = { LOW: "#22c55e", MODERATE: "#f59e0b", HIGH: "#ef4444" };

  return (
    <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 1 }}>
          ESP32 SERIAL MONITOR — 115200 BAUD — WOKWI SIMULATION
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99" }}>{logs.length} lines</div>
      </div>
      <div style={{ height: 420, overflowY: "auto", padding: 16, fontFamily: "monospace", fontSize: 12, lineHeight: 1.8 }}>
        {logs.map((log, i) => (
          <div key={i} style={{ color: log.type === "sep" ? "#2d3748" : log.type === "boot" ? "#7c3aed" : log.type === "info" ? "#63b3ed" : levelColor[log.level] || "#a0aec0" }}>
            {log.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function AboutPanel() {
  const items = [
    ["Project", "Human Stress–Environment Feedback Loop System (HSE-FLS)"],
    ["Student", "SANTHOSH V"],
    ["Roll No.", "111722203094"],
    ["Course", "22EC979 — Capstone Design Project (Minors)"],
    ["Program", "B.Tech Information Technology — IoT Specialization"],
    ["College", "R.M.K. Engineering College, Kavaraipettai — 601206"],
    ["Month", "March 2026"],
    ["Controller", "ESP32 Microcontroller (240 MHz, Dual-core, Wi-Fi)"],
    ["Sensors", "MAX30102 HRV Sensor + DS18B20 Temperature Sensor (Simulated)"],
    ["Outputs", "Green/Red/Blue LEDs + Fan/Airflow Control"],
    ["Simulation", "Wokwi IoT Simulator — wokwi.com/projects/450692130887910401"],
    ["Language", "Embedded C++ (Arduino Framework)"],
  ];
  return (
    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
        Project Information
      </div>
      {items.map(([k, v]) => (
        <div key={k} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7a99", minWidth: 100, flexShrink: 0 }}>{k}</div>
          <div style={{ fontSize: 13, color: "#d1d5db" }}>{v}</div>
        </div>
      ))}
      <div style={{ marginTop: 20, padding: 16, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10 }}>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#818cf8", marginBottom: 6 }}>THRESHOLD CLASSIFICATION LOGIC</div>
        <div style={{ fontFamily: "monospace", fontSize: 12, color: "#9ca3af", lineHeight: 2 }}>
          Low:      HRV ≥ 70 AND Temp &lt; 33°C  →  Green LED, Airflow LOW<br/>
          Moderate: HRV 40–70 OR Temp 33–36°C  →  Red LED, Airflow MEDIUM<br/>
          High:     HRV &lt; 40 OR Temp &gt; 36°C   →  Blue LED, Airflow HIGH
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [reading, setReading]   = useState(generateReading("LOW"));
  const [history, setHistory]   = useState([]);
  const [logs, setLogs]         = useState([
    { text: "HSE-FLS System Started", type: "boot" },
    { text: "────────────────────────────────────", type: "sep" },
    { text: "ESP32 Initialized | GPIO 16/17/18 configured", type: "info" },
    { text: "DallasTemperature library loaded | randomSeed(analogRead(34))", type: "info" },
    { text: "────────────────────────────────────", type: "sep" },
  ]);
  const [running, setRunning]   = useState(true);
  const [speed, setSpeed]       = useState(2000);
  const [forced, setForced]     = useState(null);
  const [cycle, setCycle]       = useState(0);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [counts, setCounts]     = useState({ LOW: 0, MODERATE: 0, HIGH: 0 });

  const MAX_HISTORY = 40;

  const tick = useCallback(() => {
    const r = generateReading(forced);
    setReading(r);
    setCycle(c => c + 1);
    setCounts(prev => ({ ...prev, [r.level]: prev[r.level] + 1 }));
    setHistory(h => [...h.slice(-MAX_HISTORY + 1), r]);
    setLogs(prev => [
      ...prev,
      { text: "────────────────────────────────────", type: "sep" },
      { text: `HRV Value: ${r.hrv} | Skin Temp: ${r.temp.toFixed(2)} °C`, type: "data" },
      { text: `Stress Level: ${r.level} | Airflow: ${STRESS_CONFIG[r.level].airflow} | Stress%: ${r.pct}`, level: r.level, type: "level" },
    ].slice(-300));
  }, [forced]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, speed);
    return () => clearInterval(id);
  }, [running, speed, tick]);

  const total = counts.LOW + counts.MODERATE + counts.HIGH || 1;

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#0a0e1a",
      color: "#f0f4ff",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    },
    header: {
      background: "rgba(10,14,26,0.95)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      position: "sticky", top: 0, zIndex: 100,
      padding: "0 24px",
    },
    headerInner: {
      maxWidth: 1200, margin: "0 auto",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 60, gap: 16, flexWrap: "wrap",
    },
    container: { maxWidth: 1200, margin: "0 auto", padding: "24px 16px" },
    grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 20 },
    grid22: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 20 },
    card: { background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 },
  };

  return (
    <div style={styles.app}>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes ledPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
        button { cursor: pointer; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              🧠
            </div>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>HSE-FLS</div>
              <div style={{ fontSize: 10, color: "#6b7a99" }}>Human Stress–Environment Feedback Loop System</div>
            </div>
          </div>
          {/* tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "6px 14px", borderRadius: 8,
                fontFamily: "monospace", fontSize: 11,
                background: activeTab === tab ? "#1e293b" : "transparent",
                border: `1px solid ${activeTab === tab ? "rgba(255,255,255,0.12)" : "transparent"}`,
                color: activeTab === tab ? "#f0f4ff" : "#6b7a99",
                letterSpacing: 0.5,
              }}>{tab}</button>
            ))}
          </div>
          {/* status */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 11, color: running ? "#22c55e" : "#f59e0b", background: running ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${running ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`, padding: "4px 10px", borderRadius: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: running ? "#22c55e" : "#f59e0b", animation: running ? "blink 2s infinite" : "none" }} />
            {running ? "RUNNING" : "PAUSED"}
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <div style={styles.container}>

        {activeTab === "Dashboard" && (
          <>
            {/* Hero */}
            <div style={{ marginBottom: 20 }}>
              <StressHero reading={reading} cycle={cycle} />
            </div>

            {/* Metrics row */}
            <div style={styles.grid2}>
              <MetricCard icon={Activity} label="Heart Rate Variability" value={reading.hrv} unit="HRV Index" color={STRESS_CONFIG[reading.level].color} barPct={reading.hrv / 89 * 100} />
              <MetricCard icon={Thermometer} label="Skin Temperature" value={`${reading.temp}°C`} unit="Degrees Celsius" color={STRESS_CONFIG[reading.level].color} barPct={(reading.temp - 31) / 7 * 100} />
              <MetricCard icon={Cpu} label="ESP32 Controller" value="ONLINE" unit="Wokwi Simulation" color="#22c55e" barPct={100} />
              <MetricCard icon={Radio} label="Monitoring Cycle" value={cycle} unit="2-second intervals" color="#818cf8" barPct={Math.min(cycle, 100)} />
            </div>

            {/* LED + Airflow */}
            <div style={styles.grid22}>
              <LEDPanel level={reading.level} />
              <AirflowPanel level={reading.level} />
            </div>

            {/* Classification History */}
            <div style={{ ...styles.card, marginBottom: 20 }}>
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                Classification History
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[["LOW","#22c55e","low"],["MODERATE","#f59e0b","mod"],["HIGH","#ef4444","high"]].map(([lvl, col, key]) => (
                  <div key={lvl} style={{ background: "#1a2235", borderRadius: 12, padding: 16, textAlign: "center", border: `1px solid rgba(255,255,255,0.05)` }}>
                    <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: col }}>{counts[lvl]}</div>
                    <div style={{ fontSize: 11, color: "#6b7a99", margin: "4px 0" }}>{lvl}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: col }}>{Math.round(counts[lvl] / total * 100)}%</div>
                    <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.round(counts[lvl] / total * 100)}%`, background: col, borderRadius: 2, transition: "width 1s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => setRunning(r => !r)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "#6366f1", border: "1px solid #6366f1", color: "white", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>
                {running ? <><Pause size={14} /> PAUSE</> : <><Play size={14} /> RESUME</>}
              </button>
              <button onClick={() => { setRunning(false); setCycle(0); setHistory([]); setCounts({ LOW:0, MODERATE:0, HIGH:0 }); setLogs([{ text: "HSE-FLS System Restarted", type: "boot" }, { text: "────────────────────────────────────", type: "sep" }]); setForced(null); setTimeout(() => setRunning(true), 100); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f4ff", fontFamily: "monospace", fontSize: 12 }}>
                <RotateCcw size={14} /> RESET
              </button>
              {["LOW","MODERATE","HIGH"].map(lvl => (
                <button key={lvl} onClick={() => { setForced(lvl); setTimeout(() => setForced(null), speed * 4); }} style={{ padding: "10px 14px", borderRadius: 10, background: "transparent", border: `1px solid ${STRESS_CONFIG[lvl].border}`, color: STRESS_CONFIG[lvl].color, fontFamily: "monospace", fontSize: 11 }}>
                  FORCE {lvl}
                </button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7a99" }}>SPEED:</span>
                <select onChange={e => setSpeed(+e.target.value)} value={speed} style={{ background: "#1a2235", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f4ff", padding: "6px 10px", borderRadius: 8, fontFamily: "monospace", fontSize: 11 }}>
                  <option value={2000}>2s — Real</option>
                  <option value={1000}>1s — Fast</option>
                  <option value={500}>0.5s — Turbo</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeTab === "Charts" && <ChartsView history={history} />}
        {activeTab === "Serial Monitor" && <SerialMonitor logs={logs} />}
        {activeTab === "About" && <AboutPanel />}

        {/* Footer */}
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "#374151", textAlign: "center", paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          SANTHOSH V | 111722203094 | 22EC979 | R.M.K. Engineering College | B.Tech IT – IoT | March 2026
        </div>
      </div>
    </div>
  );
}