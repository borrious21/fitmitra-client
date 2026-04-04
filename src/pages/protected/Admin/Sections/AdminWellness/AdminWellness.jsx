// src/pages/protected/Admin/AdminWellness/AdminWellness.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../../../services/apiClient.js";
import styles from "./Adminwellness.module.css";

function avg(arr, key) {
  if (!arr?.length) return null;
  return (arr.reduce((s, r) => s + Number(r[key] ?? 0), 0) / arr.length).toFixed(1);
}

function moodColor(score) {
  const n = Number(score);
  if (n >= 7) return "#1D9E75";
  if (n >= 5) return "#7F77DD";
  return "#E24B4A";
}

function stressColor(score) {
  const n = Number(score);
  if (n >= 7) return "#E24B4A";
  if (n >= 4) return "#BA7517";
  return "#1D9E75";
}

function KpiCard({ label, value, sub, accent, loading }) {
  return (
    <div className={styles.kpiCard} style={{ borderTopColor: accent }}>
      <div className={styles.kpiLabel}>{label}</div>
      {loading
        ? <div className={styles.sk} style={{ height: 28, width: "60%" }} />
        : <div className={styles.kpiValue}>{value ?? "—"}</div>}
      {sub && <div className={styles.kpiSub}>{sub}</div>}
    </div>
  );
}

// ─── Section Box ──────────────────────────────────────────────────────────────
function SectionBox({ title, subtitle, children }) {
  return (
    <div className={styles.sectionBox}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionTitle}>{title}</span>
        {subtitle && <span className={styles.sectionSub}>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

// ─── Mood Trend Bar Chart ──────────────────────────────────────────────────────
function MoodTrendChart({ data, loading }) {
  if (loading) return <div className={styles.sk} style={{ height: 90 }} />;
  if (!data?.length) return <div className={styles.empty}>No mood data yet</div>;

  const vals = data.map(d => Number(d.avg_mood ?? 0));
  const max  = Math.max(...vals, 10);

  return (
    <div className={styles.trendWrap}>
      <div className={styles.trendBars}>
        {data.map((d, i) => {
          const h   = Math.max(4, Math.round((vals[i] / max) * 64));
          const col = moodColor(vals[i]);
          return (
            <div key={i} className={styles.trendBarCol}>
              <div className={styles.trendBarOuter} style={{ height: 68 }}>
                <div className={styles.trendBar} style={{ height: h, background: col }} />
              </div>
              <span className={styles.trendLabel}>
                {new Date(d.day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }).split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
      <div className={styles.trendStats}>
        <div className={styles.trendStat}>
          <div className={styles.trendStatVal} style={{ color: "#7F77DD" }}>
            {avg(data, "avg_mood")}
          </div>
          <div className={styles.trendStatLabel}>avg mood</div>
        </div>
        <div className={styles.trendStat}>
          <div className={styles.trendStatVal} style={{ color: "#E24B4A" }}>
            {avg(data, "avg_stress")}
          </div>
          <div className={styles.trendStatLabel}>avg stress</div>
        </div>
        <div className={styles.trendStat}>
          <div className={styles.trendStatVal}>{data.reduce((s, d) => s + Number(d.total_logs ?? 0), 0)}</div>
          <div className={styles.trendStatLabel}>total logs</div>
        </div>
        <div className={styles.trendStat}>
          <div className={styles.trendStatVal} style={{ color: "#E24B4A" }}>
            {data.reduce((s, d) => s + Number(d.low_mood_count ?? 0), 0)}
          </div>
          <div className={styles.trendStatLabel}>low mood (&lt;4)</div>
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal bar row ───────────────────────────────────────────────────────
function BarRow({ label, value, max, color, suffix = "" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={styles.barValue} style={{ color }}>{value}{suffix}</span>
    </div>
  );
}

// ─── Top Exercises ─────────────────────────────────────────────────────────────
function TopExercises({ data, loading }) {
  if (loading) return <Skel rows={5} h={28} />;
  if (!data?.length) return <div className={styles.empty}>No session data yet</div>;
  const maxCt = data[0]?.session_count ?? 1;
  const colors = ["#7F77DD", "#378ADD", "#1D9E75", "#D85A30", "#BA7517"];
  return (
    <div>
      {data.slice(0, 5).map((ex, i) => (
        <div key={ex.exercise_name} className={styles.exRow}>
          <span className={styles.exRank}>#{i + 1}</span>
          <span className={styles.exName}>{ex.exercise_name}</span>
          <div className={styles.barTrack} style={{ flex: 1, margin: "0 10px" }}>
            <div className={styles.barFill}
              style={{ width: `${Math.round((ex.session_count / maxCt) * 100)}%`, background: colors[i] }} />
          </div>
          <span className={styles.exCount}>{ex.session_count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Mood Distribution ─────────────────────────────────────────────────────────
function MoodDistribution({ data, loading }) {
  if (loading) return <Skel rows={5} h={20} />;
  const buckets = [
    { label: "Very low (1–3)", key: "very_low",  color: "#E24B4A" },
    { label: "Low (4–5)",      key: "low",        color: "#D85A30" },
    { label: "Moderate (6–7)", key: "moderate",   color: "#7F77DD" },
    { label: "High (8–9)",     key: "high",       color: "#1D9E75" },
    { label: "Excellent (10)", key: "excellent",  color: "#1D9E75" },
  ];
  const total = buckets.reduce((s, b) => s + Number(data?.[b.key] ?? 0), 0) || 1;
  return (
    <div>
      {buckets.map(b => {
        const val = Number(data?.[b.key] ?? 0);
        const pct = Math.round((val / total) * 100);
        return (
          <div key={b.key} className={styles.barRow}>
            <span className={styles.barLabel} style={{ minWidth: 110 }}>{b.label}</span>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${pct}%`, background: b.color }} />
            </div>
            <span className={styles.barValue} style={{ color: b.color }}>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── At-Risk Users ─────────────────────────────────────────────────────────────
function AtRiskUsers({ data, loading }) {
  if (loading) return <Skel rows={4} h={48} />;
  if (!data?.length) return <div className={styles.empty}>No at-risk users</div>;
  return (
    <div>
      {data.map((u, i) => {
        const initials = (u.name ?? "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
        const mc  = moodColor(u.avg_mood);
        const sc  = stressColor(u.avg_stress);
        return (
          <div key={u.id ?? i} className={styles.userRow}>
            <div className={styles.userAv}>{initials}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{u.name}</span>
              <span className={styles.userEmail}>{u.email}</span>
            </div>
            <div className={styles.userPills}>
              <span className={styles.pill} style={{ background: `${mc}18`, color: mc }}>
                mood {Number(u.avg_mood).toFixed(1)}
              </span>
              <span className={styles.pill} style={{ background: `${sc}18`, color: sc }}>
                stress {Number(u.avg_stress).toFixed(1)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Journal Preview ───────────────────────────────────────────────────────────
function JournalPreview({ data, loading }) {
  if (loading) return <Skel rows={5} h={36} />;
  if (!data?.length) return <div className={styles.empty}>No journal entries yet</div>;
  const colors = ["#1D9E75", "#7F77DD", "#378ADD", "#D85A30", "#BA7517"];
  return (
    <div>
      {data.slice(0, 5).map((e, i) => (
        <div key={e.id ?? i} className={styles.jRow}>
          <div className={styles.jDot} style={{ background: colors[i % colors.length] }} />
          <span className={styles.jText}>{e.entry}</span>
          <span className={styles.jDate}>
            {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Stress Triggers ──────────────────────────────────────────────────────────
function StressTriggers({ data, loading }) {
  if (loading) return <Skel rows={5} h={24} />;
  if (!data?.length) return <div className={styles.empty}>No stress data yet</div>;
  const maxVal = data[0]?.count ?? 1;
  const colors = ["#E24B4A", "#D85A30", "#BA7517", "#7F77DD", "#888780"];
  return (
    <div>
      {data.slice(0, 5).map((d, i) => (
        <BarRow
          key={d.trigger_category ?? i}
          label={d.trigger_category ?? "Other"}
          value={d.count}
          max={maxVal}
          color={colors[i]}
        />
      ))}
    </div>
  );
}

// ─── Category Breakdown ────────────────────────────────────────────────────────
function CategoryBreakdown({ data, loading }) {
  if (loading) return <Skel rows={5} h={24} />;
  if (!data?.length) return <div className={styles.empty}>No session data yet</div>;
  const maxVal = data[0]?.session_count ?? 1;
  const colors = ["#7F77DD", "#378ADD", "#1D9E75", "#D85A30", "#BA7517"];
  return (
    <div>
      {data.slice(0, 5).map((d, i) => (
        <BarRow
          key={d.category_name ?? i}
          label={d.category_name ?? "Uncategorized"}
          value={d.session_count}
          max={maxVal}
          color={colors[i]}
        />
      ))}
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skel({ rows = 4, h = 36 }) {
  return (
    <div className={styles.skList}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.sk} style={{ height: h }} />
      ))}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AdminWellness() {
  const navigate = useNavigate();

  const [overview,   setOverview]   = useState(null);
  const [moodTrend,  setMoodTrend]  = useState([]);
  const [moodDist,   setMoodDist]   = useState(null);
  const [exercises,  setExercises]  = useState([]);
  const [stressCats, setStressCats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [atRisk,     setAtRisk]     = useState([]);
  const [journal,    setJournal]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [sync,       setSync]       = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, mt, md, ex, sc, cat, ar, jn] = await Promise.all([
        apiFetch("/admin/wellness/overview"),
        apiFetch("/admin/wellness/mood-trend"),
        apiFetch("/admin/wellness/mood-distribution"),
        apiFetch("/admin/wellness/top-exercises"),
        apiFetch("/admin/wellness/stress-triggers"),
        apiFetch("/admin/wellness/category-breakdown"),
        apiFetch("/admin/wellness/at-risk"),
        apiFetch("/admin/wellness/recent-journal"),
      ]);

      const u = d => d?.data ?? d;

      setOverview(u(ov));
      setMoodTrend(Array.isArray(u(mt)) ? u(mt) : []);
      setMoodDist(u(md));
      setExercises(Array.isArray(u(ex)) ? u(ex) : []);
      setStressCats(Array.isArray(u(sc)) ? u(sc) : []);
      setCategories(Array.isArray(u(cat)) ? u(cat) : []);
      setAtRisk((u(ar)?.users ?? (Array.isArray(u(ar)) ? u(ar) : [])));
      setJournal(Array.isArray(u(jn)) ? u(jn) : []);
      setSync(new Date());
    } catch (err) {
      setError(err?.message ?? "Failed to load wellness data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const ov = overview ?? {};

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Mental Wellness</h1>
          <p className={styles.sub}>
            {sync
              ? `Synced ${sync.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
              : "Loading…"}
          </p>
        </div>
        <div className={styles.topActions}>
          <button className={styles.btnRefresh} onClick={fetchAll} disabled={loading}>
            {loading ? "⟳" : "↺"} Refresh
          </button>
          <button className={styles.btnBack} onClick={() => navigate("/admin")}>← Dashboard</button>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* KPI strip */}
      <div className={styles.kpiGrid}>
        <KpiCard loading={loading} label="Mood logs today"  value={ov.mood_logs_today}     accent="#7F77DD"
          sub={ov.mood_logs_today > 0 ? `+${ov.new_mood_logs} this hour` : null} />
        <KpiCard loading={loading} label="Avg mood (7d)"    value={ov.avg_mood_7d != null ? `${Number(ov.avg_mood_7d).toFixed(1)} / 10` : null} accent="#1D9E75" />
        <KpiCard loading={loading} label="Avg stress (7d)"  value={ov.avg_stress_7d != null ? `${Number(ov.avg_stress_7d).toFixed(1)} / 10` : null} accent="#E24B4A" />
        <KpiCard loading={loading} label="Sessions today"   value={ov.sessions_today}       accent="#D85A30"
          sub={ov.total_minutes_today != null ? `${ov.total_minutes_today} min logged` : null} />
        <KpiCard loading={loading} label="Journal entries"  value={ov.journal_entries_today} accent="#BA7517"
          sub="last 24 hours" />
        <KpiCard loading={loading} label="Avg streak"       value={ov.avg_streak_days != null ? `${Number(ov.avg_streak_days).toFixed(1)} d` : null} accent="#378ADD"
          sub="active users" />
      </div>

      {/* Mood trend + stress triggers */}
      <div className={styles.row2}>
        <SectionBox title="Mood trend" subtitle="14-day platform average">
          <MoodTrendChart data={moodTrend} loading={loading} />
        </SectionBox>
        <SectionBox title="Stress triggers" subtitle="Last 30 days">
          <StressTriggers data={stressCats} loading={loading} />
        </SectionBox>
      </div>

      {/* Top exercises + distribution + journal */}
      <div className={styles.row3}>
        <SectionBox title="Top exercises" subtitle="By sessions">
          <TopExercises data={exercises} loading={loading} />
        </SectionBox>
        <SectionBox title="Mood distribution" subtitle="Score buckets">
          <MoodDistribution data={moodDist} loading={loading} />
        </SectionBox>
        <SectionBox title="Recent journal entries" subtitle="Last 5">
          <JournalPreview data={journal} loading={loading} />
        </SectionBox>
      </div>

      {/* At-risk + category breakdown */}
      <div className={styles.row2}>
        <SectionBox title="Users needing attention" subtitle="Avg mood < 4 or stress > 7 this week">
          <AtRiskUsers data={atRisk} loading={loading} />
        </SectionBox>
        <SectionBox title="Category breakdown" subtitle="Sessions by type">
          <CategoryBreakdown data={categories} loading={loading} />
        </SectionBox>
      </div>

      <div className={styles.footer}>FitMitra Admin · {new Date().getFullYear()}</div>
    </div>
  );
}