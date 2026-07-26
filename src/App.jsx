import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Home as HomeIcon,
  Dumbbell,
  TrendingUp,
  CalendarDays,
  Settings as SettingsIcon,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Search,
  Trash2,
  Copy,
  Check,
  Award,
  Minus,
  Pencil,
  Flame,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ------------------------------------------------------------------ */
/* THEME                                                               */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#0A0A0B",
  surface: "#161618",
  surface2: "#1E1E21",
  surface3: "#26262A",
  border: "#2A2A2E",
  text: "#F5F5F7",
  sub: "#9C9CA3",
  sub2: "#6B6B70",
  accent: "#C6FF3D",
  accentSoft: "rgba(198,255,61,0.14)",
  danger: "#FF453A",
  dangerSoft: "rgba(255,69,58,0.14)",
};

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", system-ui, sans-serif';

/* ------------------------------------------------------------------ */
/* DEFAULT DATA                                                        */
/* ------------------------------------------------------------------ */
const DEFAULT_EXERCISES = [
  { id: "incline-db-bench", name: "Incline Dumbbell Bench Press", group: "Piept" },
  { id: "flat-db-bench", name: "Flat Dumbbell Bench Press", group: "Piept" },
  { id: "low-high-cable-fly", name: "Low to High Cable Fly", group: "Piept" },
  { id: "cable-fly-mid", name: "Cable Fly (Middle)", group: "Piept" },
  { id: "pull-ups", name: "Pull Ups", group: "Spate" },
  { id: "lat-pulldown", name: "Lat Pulldown", group: "Spate" },
  { id: "chest-supported-row", name: "Chest Supported Row", group: "Spate" },
  { id: "cable-row", name: "Cable Row", group: "Spate" },
  { id: "cable-lateral-raise", name: "Cable Lateral Raise", group: "Umeri" },
  { id: "face-pull", name: "Face Pull", group: "Umeri" },
  { id: "scott-curl", name: "Scott Curl (Preacher Curl)", group: "Biceps" },
  { id: "hammer-curl", name: "Hammer Curl", group: "Biceps" },
  { id: "triceps-pushdown", name: "Triceps Pushdown", group: "Triceps" },
  { id: "ohead-rope-triceps", name: "Overhead Rope Triceps Extension", group: "Triceps" },
  { id: "leg-press", name: "Leg Press", group: "Cvadricepși" },
  { id: "leg-extension", name: "Leg Extension", group: "Cvadricepși" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", group: "Cvadricepși" },
  { id: "rdl", name: "Romanian Deadlift (RDL)", group: "Femurali" },
  { id: "prone-leg-curl", name: "Prone Leg Curl", group: "Femurali" },
  { id: "seated-leg-curl", name: "Seated Leg Curl", group: "Femurali" },
  { id: "smith-hip-thrust", name: "Smith Machine Hip Thrust", group: "Fesieri" },
  { id: "glute-kickback-machine", name: "Glute Kickback Machine", group: "Fesieri" },
  { id: "cable-kickback", name: "Cable Kickback", group: "Fesieri" },
  { id: "cable-crunch", name: "Cable Crunch", group: "Abdomen" },
  { id: "hanging-knee-raise", name: "Hanging Knee Raise", group: "Abdomen" },
];

const DAY_TYPES = ["Push", "Pull", "Legs", "Upper", "Lower"];

const DEFAULT_TEMPLATES = {
  Push: [
    "incline-db-bench",
    "flat-db-bench",
    "low-high-cable-fly",
    "cable-fly-mid",
    "cable-lateral-raise",
    "triceps-pushdown",
    "ohead-rope-triceps",
  ],
  Pull: [
    "pull-ups",
    "lat-pulldown",
    "chest-supported-row",
    "cable-row",
    "face-pull",
    "scott-curl",
    "hammer-curl",
  ],
  Legs: [
    "leg-press",
    "leg-extension",
    "bulgarian-split-squat",
    "rdl",
    "prone-leg-curl",
    "seated-leg-curl",
    "smith-hip-thrust",
    "glute-kickback-machine",
    "cable-kickback",
    "cable-crunch",
    "hanging-knee-raise",
  ],
  Upper: [
    "incline-db-bench",
    "flat-db-bench",
    "pull-ups",
    "lat-pulldown",
    "cable-lateral-raise",
    "face-pull",
    "hammer-curl",
    "triceps-pushdown",
  ],
  Lower: [
    "leg-press",
    "bulgarian-split-squat",
    "rdl",
    "seated-leg-curl",
    "smith-hip-thrust",
    "cable-crunch",
  ],
};

const GROUP_ORDER = [
  "Piept",
  "Spate",
  "Umeri",
  "Biceps",
  "Triceps",
  "Cvadricepși",
  "Femurali",
  "Fesieri",
  "Abdomen",
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  const today = todayISO();
  const yestD = new Date();
  yestD.setDate(yestD.getDate() - 1);
  const yest = yestD.toISOString().slice(0, 10);
  if (iso === today) return "Azi";
  if (iso === yest) return "Ieri";
  return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function formatDateShort(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit" });
}
function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function toNum(v) {
  if (v === "" || v == null) return 0;
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
}
function sessionVolume(sets) {
  return sets.reduce((s, x) => s + toNum(x.weight) * toNum(x.reps), 0);
}
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* PERSISTENT STORAGE HOOK                                             */
/* ------------------------------------------------------------------ */
const STORAGE_PREFIX = "gym-tracker:";

function useStoredState(key, initial) {
  const fullKey = STORAGE_PREFIX + key;
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(fullKey);
      return raw != null ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });

  const persist = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        try {
          localStorage.setItem(fullKey, JSON.stringify(next));
        } catch (e) {
          console.error("localStorage set failed", e);
        }
        return next;
      });
    },
    [fullKey]
  );

  return [value, persist, true];
}

/* ------------------------------------------------------------------ */
/* SMALL UI PRIMITIVES                                                 */
/* ------------------------------------------------------------------ */
function Card({ children, style, onClick, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl ${className}`}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, style, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl py-4 font-semibold text-base transition active:scale-95"
      style={{
        background: disabled ? C.surface3 : C.accent,
        color: disabled ? C.sub2 : "#0A0A0B",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, style, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition active:scale-95 ${className}`}
      style={{
        background: C.surface2,
        color: C.text,
        border: `1px solid ${C.border}`,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-medium shrink-0 transition active:scale-95"
      style={{
        background: active ? C.accent : C.surface2,
        color: active ? "#0A0A0B" : C.sub,
        border: `1px solid ${active ? C.accent : C.border}`,
      }}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      className="text-xs font-semibold uppercase px-1 mb-2"
      style={{ color: C.sub2, letterSpacing: "0.06em" }}
    >
      {children}
    </div>
  );
}

function NumField({ value, onChange, placeholder, mode = "decimal" }) {
  return (
    <input
      type="number"
      inputMode={mode}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-center rounded-xl py-2.5 text-base font-semibold outline-none"
      style={{
        background: C.surface3,
        color: C.text,
        border: `1px solid ${C.border}`,
      }}
    />
  );
}

// Text-based numeric field that accepts comma as decimal separator (e.g. 75,5)
function DecimalField({ value, onChange, placeholder }) {
  function handleChange(e) {
    let v = e.target.value.replace(/[^0-9.,]/g, "");
    const parts = v.split(/[.,]/);
    if (parts.length > 2) v = parts[0] + "," + parts.slice(1).join("");
    onChange(v);
  }
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      className="w-full text-center rounded-xl py-2.5 text-base font-semibold outline-none"
      style={{
        background: C.surface3,
        color: C.text,
        border: `1px solid ${C.border}`,
      }}
    />
  );
}

function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />
      <div
        className="relative rounded-t-3xl flex flex-col"
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          maxHeight: "85vh",
          animation: "slideUp 0.22s ease-out",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="font-semibold text-lg" style={{ color: C.text }}>
            {title}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full active:scale-90 transition" style={{ background: C.surface3 }}>
            <X size={18} color={C.sub} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4" style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = "Șterge" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onCancel} />
      <div
        className="relative rounded-2xl p-5 w-full"
        style={{ background: C.surface2, border: `1px solid ${C.border}`, maxWidth: 320 }}
      >
        <div className="font-semibold text-base mb-1" style={{ color: C.text }}>
          {title}
        </div>
        <div className="text-sm mb-4" style={{ color: C.sub }}>
          {message}
        </div>
        <div className="flex gap-2">
          <GhostButton onClick={onCancel} className="flex-1 text-center justify-center">
            Anulează
          </GhostButton>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold active:scale-95 transition"
            style={{ background: C.danger, color: "#fff" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ACTIVITY RING                                                       */
/* ------------------------------------------------------------------ */
function ActivityRing({ progress, size = 84, stroke = 10 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, progress);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surface3} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.accent}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* DATA LOGIC (pure functions over workouts array)                     */
/* ------------------------------------------------------------------ */
function getLastSessionForExercise(workouts, exerciseId, excludeWorkoutId) {
  const sorted = [...workouts]
    .filter((w) => w.id !== excludeWorkoutId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  for (const w of sorted) {
    const ex = w.exercises.find((e) => e.exerciseId === exerciseId);
    if (ex && ex.sets.length > 0) return { workout: w, sets: ex.sets };
  }
  return null;
}

function getExerciseSessions(workouts, exerciseId) {
  const sessions = [];
  for (const w of workouts) {
    const ex = w.exercises.find((e) => e.exerciseId === exerciseId);
    if (ex && ex.sets.length > 0) {
      const maxWeight = Math.max(...ex.sets.map((s) => toNum(s.weight)));
      const maxReps = Math.max(...ex.sets.map((s) => toNum(s.reps)));
      sessions.push({
        date: w.date,
        workoutId: w.id,
        sets: ex.sets,
        volume: sessionVolume(ex.sets),
        maxWeight,
        maxReps,
      });
    }
  }
  sessions.sort((a, b) => (a.date < b.date ? -1 : 1));
  return sessions;
}

function getExerciseRecords(workouts, exerciseId) {
  const sessions = getExerciseSessions(workouts, exerciseId);
  if (sessions.length === 0) return null;
  let maxWeight = -1,
    maxWeightDate = null;
  let maxVolume = -1,
    maxVolumeDate = null;
  let maxReps = -1,
    maxRepsDate = null;
  for (const s of sessions) {
    if (s.maxWeight > maxWeight) {
      maxWeight = s.maxWeight;
      maxWeightDate = s.date;
    }
    if (s.volume > maxVolume) {
      maxVolume = s.volume;
      maxVolumeDate = s.date;
    }
    if (s.maxReps > maxReps) {
      maxReps = s.maxReps;
      maxRepsDate = s.date;
    }
  }
  return { maxWeight, maxWeightDate, maxVolume, maxVolumeDate, maxReps, maxRepsDate, sessions };
}

/* ------------------------------------------------------------------ */
/* APP                                                                  */
/* ------------------------------------------------------------------ */
export default function App() {
  const [exercises, setExercises, exLoaded] = useStoredState("exercises", DEFAULT_EXERCISES);
  const [templates, setTemplates, tLoaded] = useStoredState("dayTemplates", DEFAULT_TEMPLATES);
  const [workouts, setWorkouts, wLoaded] = useStoredState("workouts", []);
  const [bodyweights, setBodyweights, bLoaded] = useStoredState("bodyweights", []);
  const [settings, setSettings, sLoaded] = useStoredState("settings", { weeklyGoal: 4 });

  const [tab, setTab] = useState("home");
  const [detail, setDetail] = useState(null); // {type:'exercise'|'workout', id}
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completionSummary, setCompletionSummary] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false); // day type picker sheet

  const ready = exLoaded && tLoaded && wLoaded && bLoaded && sLoaded;

  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
      );
    }
    document.body.style.background = C.bg;
  }, []);

  const exById = useMemo(() => {
    const m = {};
    exercises.forEach((e) => (m[e.id] = e));
    return m;
  }, [exercises]);

  const planNames = useMemo(() => Object.keys(templates), [templates]);

  function addPlan(name) {
    const n = name.trim();
    if (!n || templates[n]) return;
    setTemplates((prev) => ({ ...prev, [n]: [] }));
  }

  function deletePlan(name) {
    setTemplates((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  /* ---------------- workout builder actions ---------------- */
  function startWorkout(dayType, isManual = false) {
    const ids = templates[dayType] || [];
    setActiveWorkout({
      id: uid(),
      date: todayISO(),
      dayType,
      isManual,
      editingId: null,
      notes: "",
      exercises: ids.map((exId) => ({ exerciseId: exId, sets: [] })),
    });
    setPickerOpen(false);
    setTab("workout");
  }

  function startEditWorkout(workout) {
    setActiveWorkout({
      id: workout.id,
      date: workout.date,
      dayType: workout.dayType,
      isManual: true,
      editingId: workout.id,
      notes: workout.notes || "",
      exercises: workout.exercises.map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets.map((s) => ({ ...s })),
      })),
    });
    setDetail(null);
    setTab("workout");
  }

  function addExerciseToActive(exId) {
    setActiveWorkout((w) => {
      if (!w) return w;
      if (w.exercises.some((e) => e.exerciseId === exId)) return w;
      return { ...w, exercises: [...w.exercises, { exerciseId: exId, sets: [] }] };
    });
  }

  function removeExerciseFromActive(exId) {
    setActiveWorkout((w) => ({
      ...w,
      exercises: w.exercises.filter((e) => e.exerciseId !== exId),
    }));
  }

  function updateActiveSets(exId, sets) {
    setActiveWorkout((w) => ({
      ...w,
      exercises: w.exercises.map((e) => (e.exerciseId === exId ? { ...e, sets } : e)),
    }));
  }

  function copyLastWorkout(exId) {
    const last = getLastSessionForExercise(workouts, exId, null);
    if (!last) return;
    updateActiveSets(
      exId,
      last.sets.map((s) => ({ weight: s.weight, reps: s.reps }))
    );
  }

  function cancelActiveWorkout() {
    const editingId = activeWorkout?.editingId;
    setActiveWorkout(null);
    if (editingId) {
      setDetail({ type: "workout", id: editingId });
      setTab("history");
    }
  }

  function finishWorkout() {
    if (!activeWorkout) return;
    const cleanExercises = activeWorkout.exercises
      .map((e) => ({
        exerciseId: e.exerciseId,
        sets: e.sets.filter((s) => s.weight !== "" && s.reps !== "" && s.weight != null && s.reps != null),
      }))
      .filter((e) => e.sets.length > 0);

    const editingId = activeWorkout.editingId;

    if (cleanExercises.length === 0) {
      if (editingId) {
        setWorkouts((prev) => prev.filter((w) => w.id !== editingId));
        setDetail(null);
        setTab("history");
      } else {
        setTab("home");
      }
      setActiveWorkout(null);
      return;
    }

    if (editingId) {
      const updatedWorkout = {
        id: editingId,
        date: activeWorkout.date,
        dayType: activeWorkout.dayType,
        notes: activeWorkout.notes,
        exercises: cleanExercises,
      };
      setWorkouts((prev) => prev.map((w) => (w.id === editingId ? updatedWorkout : w)));
      setActiveWorkout(null);
      setDetail({ type: "workout", id: editingId });
      setTab("history");
      return;
    }

    let newRecords = [];
    let progressed = [];
    let totalVolume = 0;

    for (const e of cleanExercises) {
      const vol = sessionVolume(e.sets);
      totalVolume += vol;
      const prevRecords = getExerciseRecords(workouts, e.exerciseId);
      const currentMaxWeight = Math.max(...e.sets.map((s) => toNum(s.weight)));
      if (!prevRecords || currentMaxWeight > prevRecords.maxWeight) {
        newRecords.push({ exerciseId: e.exerciseId, weight: currentMaxWeight });
      }
      const last = getLastSessionForExercise(workouts, e.exerciseId, null);
      if (last) {
        const lastVol = sessionVolume(last.sets);
        if (vol > lastVol) progressed.push(e.exerciseId);
      }
    }

    const finalWorkout = {
      id: activeWorkout.id,
      date: activeWorkout.date,
      dayType: activeWorkout.dayType,
      notes: activeWorkout.notes,
      exercises: cleanExercises,
    };

    setWorkouts((prev) => [...prev, finalWorkout]);
    setCompletionSummary({
      totalVolume,
      newRecords,
      progressed,
    });
    setActiveWorkout(null);
  }

  function deleteWorkout(workoutId) {
    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  }

  const weekCount = useMemo(() => {
    const ws = startOfWeek(new Date());
    return workouts.filter((w) => new Date(w.date + "T00:00:00") >= ws).length;
  }, [workouts]);

  const monthCount = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return workouts.filter((w) => w.date.startsWith(ym)).length;
  }, [workouts]);

  const lastWorkout = useMemo(() => {
    if (workouts.length === 0) return null;
    return [...workouts].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  }, [workouts]);

  const currentBodyweight = useMemo(() => {
    if (bodyweights.length === 0) return null;
    return [...bodyweights].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  }, [bodyweights]);

  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bg, fontFamily: FONT }}
      >
        <div style={{ color: C.sub }}>Se încarcă...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: C.bg,
        fontFamily: FONT,
        color: C.text,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0.6; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 90, animation: "fadeIn 0.25s ease" }}>
        {tab === "home" && (
          <HomeView
            weekCount={weekCount}
            goal={settings.weeklyGoal}
            monthCount={monthCount}
            lastWorkout={lastWorkout}
            exById={exById}
            currentBodyweight={currentBodyweight}
            onStart={() => setPickerOpen(true)}
          />
        )}

        {tab === "workout" &&
          (activeWorkout ? (
            <WorkoutBuilder
              activeWorkout={activeWorkout}
              setActiveWorkout={setActiveWorkout}
              exById={exById}
              exercises={exercises}
              workouts={workouts}
              onUpdateSets={updateActiveSets}
              onCopyLast={copyLastWorkout}
              onAddExercise={addExerciseToActive}
              onRemoveExercise={removeExerciseFromActive}
              onFinish={finishWorkout}
              onCancel={cancelActiveWorkout}
            />
          ) : (
            <WorkoutPicker onPick={(d) => startWorkout(d, false)} planNames={planNames} />
          ))}

        {tab === "progress" &&
          (detail && detail.type === "exercise" ? (
            <ExerciseDetail
              exercise={exById[detail.id]}
              workouts={workouts}
              onBack={() => setDetail(null)}
            />
          ) : (
            <ProgressView exercises={exercises} workouts={workouts} onSelect={(id) => setDetail({ type: "exercise", id })} />
          ))}

        {tab === "history" &&
          (detail && detail.type === "workout" ? (
            <WorkoutDetail
              workout={workouts.find((w) => w.id === detail.id)}
              exById={exById}
              onBack={() => setDetail(null)}
              onEdit={() => startEditWorkout(workouts.find((w) => w.id === detail.id))}
              onDelete={() => {
                deleteWorkout(detail.id);
                setDetail(null);
              }}
            />
          ) : (
            <HistoryView
              workouts={workouts}
              exById={exById}
              onSelect={(id) => setDetail({ type: "workout", id })}
              onAddPast={() => setPickerOpen(true)}
            />
          ))}

        {tab === "settings" && (
          <SettingsView
            exercises={exercises}
            setExercises={setExercises}
            templates={templates}
            setTemplates={setTemplates}
            bodyweights={bodyweights}
            setBodyweights={setBodyweights}
            settings={settings}
            setSettings={setSettings}
            workouts={workouts}
            setWorkouts={setWorkouts}
          />
        )}
      </div>

      <BottomNav
        tab={tab}
        setTab={(t) => {
          setDetail(null);
          setTab(t);
        }}
      />

      <BottomSheet open={pickerOpen} onClose={() => setPickerOpen(false)} title="Alege tipul antrenamentului">
        {planNames.length === 0 ? (
          <div className="text-sm text-center py-6" style={{ color: C.sub2 }}>
            Niciun plan creat. Adaugă unul din Settings.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-2">
            {planNames.map((d) => (
              <button
                key={d}
                onClick={() => startWorkout(d, false)}
                className="rounded-2xl py-5 font-semibold text-base transition active:scale-95"
                style={{ background: C.surface2, border: `1px solid ${C.border}`, color: C.text }}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </BottomSheet>

      {completionSummary && (
        <CompletionOverlay
          summary={completionSummary}
          exById={exById}
          onClose={() => {
            setCompletionSummary(null);
            setTab("home");
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BOTTOM NAV                                                          */
/* ------------------------------------------------------------------ */
function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "workout", label: "Workout", icon: Dumbbell },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "history", label: "History", icon: CalendarDays },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center z-40"
      style={{
        background: "rgba(21,21,23,0.94)",
        borderTop: `1px solid ${C.border}`,
        paddingTop: 8,
        paddingBottom: "calc(env(safe-area-inset-bottom, 8px) + 8px)",
      }}
    >
      {items.map((it) => {
        const Icon = it.icon;
        const active = tab === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="flex flex-col items-center gap-1 transition active:scale-90"
            style={{ minWidth: 56 }}
          >
            <Icon size={22} color={active ? C.accent : C.sub2} strokeWidth={active ? 2.4 : 2} />
            <span className="text-xs font-medium" style={{ color: active ? C.accent : C.sub2 }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HOME VIEW                                                           */
/* ------------------------------------------------------------------ */
function HomeView({ weekCount, goal, monthCount, lastWorkout, exById, currentBodyweight, onStart }) {
  const pct = goal > 0 ? weekCount / goal : 0;
  return (
    <div className="px-4 pt-5">
      <div className="text-2xl font-bold mb-5 px-1">Gym Tracker</div>

      <Card style={{ padding: 18 }} className="mb-4">
        <div className="flex items-center gap-4">
          <ActivityRing progress={pct} />
          <div className="flex-1">
            <div className="text-sm font-medium" style={{ color: C.sub }}>
              Antrenamente săptămânale
            </div>
            <div className="text-2xl font-bold mt-0.5">
              {weekCount} <span style={{ color: C.sub2, fontWeight: 500, fontSize: 16 }}>/ {goal}</span>
            </div>
          </div>
          {weekCount >= goal && goal > 0 && <Flame size={22} color={C.accent} />}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatTile label="Workout-uri lunare" value={monthCount} />
        <StatTile
          label="Greutate corporală"
          value={currentBodyweight ? `${currentBodyweight.weight} kg` : "-"}
        />
      </div>

      <Card style={{ padding: 16 }} className="mb-6">
        <div className="text-sm font-medium mb-1" style={{ color: C.sub }}>
          Ultimul antrenament
        </div>
        {lastWorkout ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{lastWorkout.dayType}</div>
              <div className="text-sm" style={{ color: C.sub2 }}>
                {formatDate(lastWorkout.date)} · {lastWorkout.exercises.length} exerciții
              </div>
            </div>
            <div className="text-sm font-semibold" style={{ color: C.accent }}>
              {Math.round(lastWorkout.exercises.reduce((s, e) => s + sessionVolume(e.sets), 0)).toLocaleString()} kg
            </div>
          </div>
        ) : (
          <div className="text-sm" style={{ color: C.sub2 }}>
            Niciun antrenament încă
          </div>
        )}
      </Card>

      <PrimaryButton onClick={onStart} style={{ fontSize: 17 }}>
        Start Workout
      </PrimaryButton>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <Card style={{ padding: 16 }}>
      <div className="text-xs font-medium mb-1.5" style={{ color: C.sub }}>
        {label}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* WORKOUT PICKER (empty state on Workout tab)                         */
/* ------------------------------------------------------------------ */
function WorkoutPicker({ onPick, planNames }) {
  return (
    <div className="px-4 pt-5">
      <div className="text-2xl font-bold mb-5 px-1">Workout</div>
      <SectionLabel>Alege tipul de azi</SectionLabel>
      {planNames.length === 0 ? (
        <div className="text-sm text-center py-8" style={{ color: C.sub2 }}>
          Niciun plan creat. Adaugă unul din Settings.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {planNames.map((d) => (
            <button
              key={d}
              onClick={() => onPick(d)}
              className="rounded-2xl py-6 font-semibold text-base transition active:scale-95"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
            >
              {d}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WORKOUT BUILDER                                                     */
/* ------------------------------------------------------------------ */
function WorkoutBuilder({
  activeWorkout,
  setActiveWorkout,
  exById,
  exercises,
  workouts,
  onUpdateSets,
  onCopyLast,
  onAddExercise,
  onRemoveExercise,
  onFinish,
  onCancel,
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const availableToAdd = exercises.filter(
    (e) =>
      !activeWorkout.exercises.some((ae) => ae.exerciseId === e.id) &&
      e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-5">
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{activeWorkout.dayType}</div>
          {activeWorkout.editingId && (
            <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background: C.accentSoft, color: C.accent }}>
              Editare
            </span>
          )}
        </div>
        <button onClick={() => setConfirmCancel(true)} className="text-sm font-medium" style={{ color: C.danger }}>
          Anulează
        </button>
      </div>
      <div className="px-1 mb-4">
        <input
          type="date"
          value={activeWorkout.date}
          onChange={(e) => setActiveWorkout((w) => ({ ...w, date: e.target.value }))}
          className="rounded-lg px-2.5 py-1.5 text-sm outline-none"
          style={{ background: C.surface2, color: C.sub, border: `1px solid ${C.border}` }}
        />
      </div>

      <div className="space-y-3">
        {activeWorkout.exercises.map((e) => (
          <ExerciseLogCard
            key={e.exerciseId}
            exercise={exById[e.exerciseId]}
            sets={e.sets}
            workouts={workouts}
            onChange={(sets) => onUpdateSets(e.exerciseId, sets)}
            onCopyLast={() => onCopyLast(e.exerciseId)}
            onRemove={() => onRemoveExercise(e.exerciseId)}
          />
        ))}
      </div>

      <button
        onClick={() => setAddOpen(true)}
        className="w-full mt-3 rounded-2xl py-3.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
        style={{ background: C.surface2, border: `1px dashed ${C.border}`, color: C.sub }}
      >
        <Plus size={16} /> Adaugă exercițiu
      </button>

      <div className="mt-5">
        <SectionLabel>Notițe antrenament</SectionLabel>
        <textarea
          value={activeWorkout.notes}
          onChange={(e) => setActiveWorkout((w) => ({ ...w, notes: e.target.value }))}
          placeholder="ex: Dormit prost, energie multă, durere cot..."
          rows={3}
          className="w-full rounded-2xl p-3.5 text-sm outline-none resize-none"
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
        />
      </div>

      <div className="mt-5 mb-2">
        <PrimaryButton onClick={onFinish}>
          {activeWorkout.editingId ? "Salvează modificările" : "Finalizează Workout"}
        </PrimaryButton>
      </div>

      <BottomSheet open={addOpen} onClose={() => setAddOpen(false)} title="Adaugă exercițiu">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3" style={{ background: C.surface3 }}>
          <Search size={16} color={C.sub2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută exercițiu"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: C.text }}
          />
        </div>
        <div className="space-y-1.5 pb-4">
          {availableToAdd.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                onAddExercise(e.id);
                setAddOpen(false);
                setSearch("");
              }}
              className="w-full flex items-center justify-between rounded-xl px-3.5 py-3 transition active:scale-95"
              style={{ background: C.surface2 }}
            >
              <div className="text-left">
                <div className="text-sm font-medium">{e.name}</div>
                <div className="text-xs" style={{ color: C.sub2 }}>
                  {e.group}
                </div>
              </div>
              <Plus size={16} color={C.accent} />
            </button>
          ))}
          {availableToAdd.length === 0 && (
            <div className="text-sm text-center py-6" style={{ color: C.sub2 }}>
              Niciun exercițiu găsit
            </div>
          )}
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={confirmCancel}
        title="Anulezi antrenamentul?"
        message="Datele introduse acum se vor pierde."
        confirmLabel="Anulează antrenamentul"
        onCancel={() => setConfirmCancel(false)}
        onConfirm={() => {
          setConfirmCancel(false);
          onCancel();
        }}
      />
    </div>
  );
}

function ExerciseLogCard({ exercise, sets, workouts, onChange, onCopyLast, onRemove }) {
  const [open, setOpen] = useState(true);
  if (!exercise) return null;
  const last = getLastSessionForExercise(workouts, exercise.id, null);
  const hasFilled = sets.some((s) => s.weight !== "" && s.reps !== "" && s.weight != null && s.reps != null);

  function addSet() {
    onChange([...sets, { weight: "", reps: "" }]);
  }
  function updateSet(idx, field, val) {
    const next = sets.map((s, i) => (i === idx ? { ...s, [field]: val } : s));
    onChange(next);
  }
  function removeSet(idx) {
    onChange(sets.filter((_, i) => i !== idx));
  }

  return (
    <Card
      style={{
        padding: 16,
        background: hasFilled ? "rgba(198,255,61,0.07)" : C.surface,
        border: `1px solid ${hasFilled ? "rgba(198,255,61,0.35)" : C.border}`,
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div className="flex items-start justify-between mb-1">
        <button className="text-left flex-1" onClick={() => setOpen((o) => !o)}>
          <div className="flex items-center gap-1.5">
            <div className="font-semibold text-base">{exercise.name}</div>
            {hasFilled && (
              <span
                className="rounded-full flex items-center justify-center shrink-0"
                style={{ width: 16, height: 16, background: C.accent }}
              >
                <Check size={10} color="#0A0A0B" strokeWidth={3} />
              </span>
            )}
          </div>
          <div className="text-xs" style={{ color: C.sub2 }}>
            {exercise.group}
          </div>
        </button>
        <button onClick={onRemove} className="p-1 -mt-1 -mr-1 active:scale-90 transition">
          <X size={16} color={C.sub2} />
        </button>
      </div>

      {open && (
        <>
          <div className="mt-3 mb-3">
            <div className="text-xs font-medium mb-1.5" style={{ color: C.sub2 }}>
              Last Workout
            </div>
            {last ? (
              <div className="flex flex-wrap gap-1.5">
                {last.sets.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium rounded-lg px-2 py-1"
                    style={{ background: C.surface3, color: C.sub }}
                  >
                    {s.weight} kg × {s.reps}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs" style={{ color: C.sub2 }}>
                Fără istoric
              </div>
            )}
          </div>

          <div className="space-y-2 mb-3">
            {sets.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="text-xs font-semibold w-10 text-center shrink-0"
                  style={{ color: C.sub2 }}
                >
                  Set {i + 1}
                </div>
                <div className="flex-1">
                  <DecimalField value={s.weight} onChange={(v) => updateSet(i, "weight", v)} placeholder="kg" />
                </div>
                <div className="flex-1">
                  <NumField value={s.reps} onChange={(v) => updateSet(i, "reps", v)} placeholder="reps" mode="numeric" />
                </div>
                <button onClick={() => removeSet(i)} className="p-1.5 shrink-0 active:scale-90 transition">
                  <Minus size={15} color={C.sub2} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <GhostButton onClick={addSet} className="flex-1 flex items-center justify-center gap-1">
              <Plus size={14} /> Adaugă set
            </GhostButton>
            {last && (
              <GhostButton onClick={onCopyLast} className="flex-1 flex items-center justify-center gap-1">
                <Copy size={14} /> Copy Last
              </GhostButton>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* COMPLETION OVERLAY                                                  */
/* ------------------------------------------------------------------ */
function CompletionOverlay({ summary, exById, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(10,10,11,0.92)" }}>
      <div className="w-full text-center" style={{ maxWidth: 340, animation: "fadeIn 0.3s ease" }}>
        <div
          className="mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ width: 72, height: 72, background: C.accentSoft }}
        >
          <Check size={34} color={C.accent} />
        </div>
        <div className="text-2xl font-bold mb-1">Workout Completed</div>
        <div className="text-sm mb-6" style={{ color: C.sub }}>
          Bravo! Antrenamentul a fost salvat.
        </div>

        <Card style={{ padding: 18 }} className="mb-3 text-left">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: C.sub }}>
              Volum total
            </span>
            <span className="text-lg font-bold">{Math.round(summary.totalVolume).toLocaleString()} kg</span>
          </div>
        </Card>

        {summary.newRecords.length > 0 && (
          <Card style={{ padding: 18 }} className="mb-3 text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <Award size={16} color={C.accent} />
              <span className="text-sm font-semibold" style={{ color: C.accent }}>
                Recorduri noi
              </span>
            </div>
            <div className="space-y-1">
              {summary.newRecords.map((r) => (
                <div key={r.exerciseId} className="text-sm" style={{ color: C.text }}>
                  {exById[r.exerciseId]?.name} — {r.weight} kg
                </div>
              ))}
            </div>
          </Card>
        )}

        {summary.progressed.length > 0 && (
          <Card style={{ padding: 18 }} className="mb-5 text-left">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp size={16} color={C.accent} />
              <span className="text-sm font-semibold" style={{ color: C.text }}>
                Ai progresat la
              </span>
            </div>
            <div className="space-y-1">
              {summary.progressed.map((id) => (
                <div key={id} className="text-sm" style={{ color: C.sub }}>
                  {exById[id]?.name}
                </div>
              ))}
            </div>
          </Card>
        )}

        <PrimaryButton onClick={onClose}>Închide</PrimaryButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PROGRESS VIEW                                                       */
/* ------------------------------------------------------------------ */
function ProgressView({ exercises, workouts, onSelect }) {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("exercises"); // exercises | records

  const filtered = exercises.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: filtered.filter((e) => e.group === g),
  })).filter((g) => g.items.length > 0);

  const recordsList = exercises
    .map((e) => ({ ex: e, rec: getExerciseRecords(workouts, e.id) }))
    .filter((r) => r.rec && r.ex.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.ex.name.localeCompare(b.ex.name));

  return (
    <div className="px-4 pt-5">
      <div className="text-2xl font-bold mb-4 px-1">Progress</div>

      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3" style={{ background: C.surface }}>
        <Search size={16} color={C.sub2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută exercițiu"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: C.text }}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Chip active={mode === "exercises"} onClick={() => setMode("exercises")}>
          Exerciții
        </Chip>
        <Chip active={mode === "records"} onClick={() => setMode("records")}>
          Recorduri
        </Chip>
      </div>

      {mode === "exercises" ? (
        <div className="space-y-5">
          {grouped.map((g) => (
            <div key={g.group}>
              <SectionLabel>{g.group}</SectionLabel>
              <Card style={{ padding: 4 }}>
                {g.items.map((e, i) => {
                  const rec = getExerciseRecords(workouts, e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => onSelect(e.id)}
                      className="w-full flex items-center justify-between px-3.5 py-3 transition active:scale-95"
                      style={{
                        borderTop: i > 0 ? `1px solid ${C.border}` : "none",
                      }}
                    >
                      <span className="text-sm font-medium text-left">{e.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs" style={{ color: C.sub2 }}>
                          {rec ? `PR ${rec.maxWeight} kg` : "—"}
                        </span>
                        <ChevronRight size={15} color={C.sub2} />
                      </div>
                    </button>
                  );
                })}
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {recordsList.map(({ ex, rec }) => (
            <Card key={ex.id} style={{ padding: 14 }} onClick={() => onSelect(ex.id)} className="active:scale-95 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{ex.name}</span>
                <ChevronRight size={15} color={C.sub2} />
              </div>
              <div className="flex gap-4">
                <RecMini label="Greutate max" value={`${rec.maxWeight} kg`} />
                <RecMini label="Rep-uri max" value={rec.maxReps} />
                <RecMini label="Volum max" value={`${Math.round(rec.maxVolume)} kg`} />
              </div>
            </Card>
          ))}
          {recordsList.length === 0 && (
            <div className="text-sm text-center py-8" style={{ color: C.sub2 }}>
              Niciun record încă
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecMini({ label, value }) {
  return (
    <div>
      <div className="text-xs" style={{ color: C.sub2 }}>
        {label}
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EXERCISE DETAIL                                                     */
/* ------------------------------------------------------------------ */
function ExerciseDetail({ exercise, workouts, onBack }) {
  const [range, setRange] = useState("all"); // 30 | 90 | 365 | all
  if (!exercise) return null;

  const rec = getExerciseRecords(workouts, exercise.id);
  const sessions = rec ? rec.sessions : [];

  const filtered = useMemo(() => {
    if (range === "all") return sessions;
    const days = range === "30" ? 30 : range === "90" ? 90 : 365;
    const cutoff = daysAgo(days);
    return sessions.filter((s) => s.date >= cutoff);
  }, [sessions, range]);

  const chartData = filtered.map((s) => ({
    date: formatDateShort(s.date),
    weight: s.maxWeight,
  }));

  const totalVolume = sessions.reduce((a, s) => a + s.volume, 0);

  return (
    <div className="px-4 pt-5">
      <button onClick={onBack} className="flex items-center gap-1 mb-3 text-sm font-medium" style={{ color: C.accent }}>
        <ChevronLeft size={16} /> Progress
      </button>
      <div className="text-xl font-bold mb-1 px-0.5">{exercise.name}</div>
      <div className="text-sm mb-4 px-0.5" style={{ color: C.sub2 }}>
        {exercise.group}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatTile label="Greutate maximă" value={rec ? `${rec.maxWeight} kg` : "-"} />
        <StatTile label="Volum total" value={`${Math.round(totalVolume).toLocaleString()} kg`} />
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto">
        <Chip active={range === "30"} onClick={() => setRange("30")}>
          30 zile
        </Chip>
        <Chip active={range === "90"} onClick={() => setRange("90")}>
          3 luni
        </Chip>
        <Chip active={range === "365"} onClick={() => setRange("365")}>
          1 an
        </Chip>
        <Chip active={range === "all"} onClick={() => setRange("all")}>
          Tot istoricul
        </Chip>
      </div>

      <Card style={{ padding: "16px 8px 8px 0" }} className="mb-5">
        {chartData.length > 1 ? (
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid stroke={C.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke={C.sub2} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={C.sub2} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: C.sub }}
                />
                <Line type="monotone" dataKey="weight" stroke={C.accent} strokeWidth={2.5} dot={{ r: 3, fill: C.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-sm text-center py-10" style={{ color: C.sub2 }}>
            Ai nevoie de cel puțin 2 sesiuni pentru grafic
          </div>
        )}
      </Card>

      {rec && (
        <Card style={{ padding: 16 }} className="mb-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Award size={15} color={C.accent} />
            <span className="text-sm font-semibold">Recorduri</span>
          </div>
          <div className="space-y-2.5">
            <RecordRow label="Greutate maximă" value={`${rec.maxWeight} kg`} date={rec.maxWeightDate} />
            <RecordRow label="Cele mai multe repetări" value={rec.maxReps} date={rec.maxRepsDate} />
            <RecordRow label="Volum maxim / sesiune" value={`${Math.round(rec.maxVolume)} kg`} date={rec.maxVolumeDate} />
          </div>
        </Card>
      )}

      <SectionLabel>Ultimele {Math.min(10, sessions.length)} sesiuni</SectionLabel>
      <div className="space-y-2 mb-4">
        {[...sessions]
          .reverse()
          .slice(0, 10)
          .map((s, i) => (
            <Card key={i} style={{ padding: 14 }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold">{formatDate(s.date)}</span>
                <span className="text-xs font-medium" style={{ color: C.sub2 }}>
                  {Math.round(s.volume)} kg volum
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.sets.map((set, j) => (
                  <span key={j} className="text-xs font-medium rounded-lg px-2 py-1" style={{ background: C.surface3, color: C.sub }}>
                    {set.weight} kg × {set.reps}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        {sessions.length === 0 && (
          <div className="text-sm text-center py-6" style={{ color: C.sub2 }}>
            Fără sesiuni încă
          </div>
        )}
      </div>
    </div>
  );
}

function RecordRow({ label, value, date }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: C.sub }}>
        {label}
      </span>
      <div className="text-right">
        <div className="text-sm font-semibold">{value}</div>
        <div className="text-xs" style={{ color: C.sub2 }}>
          {formatDate(date)}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HISTORY VIEW                                                        */
/* ------------------------------------------------------------------ */
function HistoryView({ workouts, exById, onSelect, onAddPast }) {
  const [search, setSearch] = useState("");

  const sorted = [...workouts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const filtered = sorted.filter((w) => {
    if (!search) return true;
    const s = search.toLowerCase();
    if (w.dayType.toLowerCase().includes(s)) return true;
    return w.exercises.some((e) => exById[e.exerciseId]?.name.toLowerCase().includes(s));
  });

  return (
    <div className="px-4 pt-5">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-2xl font-bold">History</div>
        <button onClick={onAddPast} className="p-2 rounded-full active:scale-90 transition" style={{ background: C.surface2 }}>
          <Plus size={18} color={C.accent} />
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4" style={{ background: C.surface }}>
        <Search size={16} color={C.sub2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută exercițiu sau tip"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: C.text }}
        />
      </div>

      <div className="space-y-2.5">
        {filtered.map((w) => (
          <Card
            key={w.id}
            style={{ padding: 15 }}
            onClick={() => onSelect(w.id)}
            className="transition active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-base">{w.dayType}</div>
                <div className="text-xs mt-0.5" style={{ color: C.sub2 }}>
                  {formatDate(w.date)} · {w.exercises.length} exerciții
                </div>
                {w.notes && (
                  <div className="text-xs mt-1 truncate" style={{ color: C.sub, maxWidth: 220 }}>
                    "{w.notes}"
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold" style={{ color: C.accent }}>
                  {Math.round(w.exercises.reduce((s, e) => s + sessionVolume(e.sets), 0)).toLocaleString()} kg
                </span>
                <ChevronRight size={16} color={C.sub2} />
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-center py-10" style={{ color: C.sub2 }}>
            Niciun antrenament găsit
          </div>
        )}
      </div>
    </div>
  );
}

function WorkoutDetail({ workout, exById, onBack, onDelete, onEdit }) {
  const [confirmDel, setConfirmDel] = useState(false);
  if (!workout) return null;
  const totalVolume = workout.exercises.reduce((s, e) => s + sessionVolume(e.sets), 0);

  return (
    <div className="px-4 pt-5">
      <button onClick={onBack} className="flex items-center gap-1 mb-3 text-sm font-medium" style={{ color: C.accent }}>
        <ChevronLeft size={16} /> History
      </button>

      <div className="flex items-center justify-between mb-1 px-0.5">
        <div className="text-xl font-bold">{workout.dayType}</div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-2 rounded-full active:scale-90 transition" style={{ background: C.surface2 }}>
            <Pencil size={16} color={C.sub} />
          </button>
          <button onClick={() => setConfirmDel(true)} className="p-2 rounded-full active:scale-90 transition" style={{ background: C.dangerSoft }}>
            <Trash2 size={16} color={C.danger} />
          </button>
        </div>
      </div>
      <div className="text-sm mb-4 px-0.5" style={{ color: C.sub2 }}>
        {formatDate(workout.date)} · {Math.round(totalVolume).toLocaleString()} kg volum total
      </div>

      <div className="space-y-3 mb-4">
        {workout.exercises.map((e) => (
          <Card key={e.exerciseId} style={{ padding: 15 }}>
            <div className="font-semibold text-sm mb-2">{exById[e.exerciseId]?.name}</div>
            <div className="flex flex-wrap gap-1.5">
              {e.sets.map((s, i) => (
                <span key={i} className="text-xs font-medium rounded-lg px-2 py-1" style={{ background: C.surface3, color: C.sub }}>
                  {s.weight} kg × {s.reps}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {workout.notes && (
        <Card style={{ padding: 15 }} className="mb-4">
          <div className="text-xs font-semibold mb-1" style={{ color: C.sub2 }}>
            Notițe
          </div>
          <div className="text-sm" style={{ color: C.text }}>
            {workout.notes}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmDel}
        title="Ștergi antrenamentul?"
        message="Această acțiune nu poate fi anulată."
        onCancel={() => setConfirmDel(false)}
        onConfirm={onDelete}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SETTINGS VIEW                                                       */
/* ------------------------------------------------------------------ */
function SettingsView({
  exercises,
  setExercises,
  templates,
  setTemplates,
  bodyweights,
  setBodyweights,
  settings,
  setSettings,
  workouts,
  setWorkouts,
}) {
  const [templateEditor, setTemplateEditor] = useState(null); // dayType string
  const [addExOpen, setAddExOpen] = useState(false);
  const [addBwOpen, setAddBwOpen] = useState(false);
  const [editBw, setEditBw] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [newExName, setNewExName] = useState("");
  const [newExGroup, setNewExGroup] = useState(GROUP_ORDER[0]);
  const [bwWeight, setBwWeight] = useState("");
  const [bwDate, setBwDate] = useState(todayISO());
  const [confirmDelEx, setConfirmDelEx] = useState(null);
  const [addPlanOpen, setAddPlanOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [confirmDelPlan, setConfirmDelPlan] = useState(null);

  const planNames = Object.keys(templates);

  function addPlan() {
    const name = newPlanName.trim();
    if (!name || templates[name]) return;
    setTemplates((prev) => ({ ...prev, [name]: [] }));
    setNewPlanName("");
    setAddPlanOpen(false);
  }

  function deletePlan(name) {
    setTemplates((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setConfirmDelPlan(null);
  }

  const sortedBw = [...bodyweights].sort((a, b) => (a.date < b.date ? 1 : -1));
  const bwChart = [...bodyweights].sort((a, b) => (a.date < b.date ? -1 : 1)).map((b) => ({
    date: formatDateShort(b.date),
    weight: toNum(b.weight),
  }));

  function addBodyweight() {
    if (!bwWeight) return;
    if (editBw) {
      setBodyweights((prev) => prev.map((b) => (b.id === editBw.id ? { ...b, weight: bwWeight, date: bwDate } : b)));
    } else {
      setBodyweights((prev) => [...prev, { id: uid(), weight: bwWeight, date: bwDate }]);
    }
    setAddBwOpen(false);
    setEditBw(null);
    setBwWeight("");
    setBwDate(todayISO());
  }

  function addExercise() {
    if (!newExName.trim()) return;
    const id = newExName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + uid().slice(0, 4);
    setExercises((prev) => [...prev, { id, name: newExName.trim(), group: newExGroup }]);
    setNewExName("");
    setAddExOpen(false);
  }

  function deleteExercise(id) {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    setTemplates((prev) => {
      const next = {};
      for (const k of Object.keys(prev)) next[k] = prev[k].filter((x) => x !== id);
      return next;
    });
    setConfirmDelEx(null);
  }

  function resetAll() {
    setExercises(DEFAULT_EXERCISES);
    setTemplates(DEFAULT_TEMPLATES);
    setWorkouts([]);
    setBodyweights([]);
    setSettings({ weeklyGoal: 4 });
    setConfirmReset(false);
  }

  const grouped = GROUP_ORDER.map((g) => ({ group: g, items: exercises.filter((e) => e.group === g) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="text-2xl font-bold mb-5 px-1">Settings</div>

      {/* Weekly goal */}
      <SectionLabel>Obiectiv săptămânal</SectionLabel>
      <Card style={{ padding: 16 }} className="mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Antrenamente / săptămână</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettings((s) => ({ ...s, weeklyGoal: Math.max(1, s.weeklyGoal - 1) }))}
              className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition"
              style={{ background: C.surface3 }}
            >
              <Minus size={14} />
            </button>
            <span className="text-lg font-bold w-5 text-center">{settings.weeklyGoal}</span>
            <button
              onClick={() => setSettings((s) => ({ ...s, weeklyGoal: Math.min(7, s.weeklyGoal + 1) }))}
              className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition"
              style={{ background: C.surface3 }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </Card>

      {/* Bodyweight */}
      <div className="flex items-center justify-between mb-2 px-1">
        <SectionLabel>Greutate corporală</SectionLabel>
        <button
          onClick={() => {
            setEditBw(null);
            setBwWeight("");
            setBwDate(todayISO());
            setAddBwOpen(true);
          }}
          className="text-xs font-semibold mb-2"
          style={{ color: C.accent }}
        >
          + Adaugă
        </button>
      </div>
      {bwChart.length > 1 && (
        <Card style={{ padding: "14px 8px 4px 0" }} className="mb-3">
          <div style={{ width: "100%", height: 120 }}>
            <ResponsiveContainer>
              <LineChart data={bwChart} margin={{ top: 4, right: 16, left: -24, bottom: 0 }}>
                <XAxis dataKey="date" stroke={C.sub2} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={C.sub2} fontSize={10} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke={C.accent} strokeWidth={2} dot={{ r: 2.5, fill: C.accent }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
      <Card style={{ padding: 4 }} className="mb-6">
        {sortedBw.slice(0, 8).map((b, i) => (
          <div
            key={b.id}
            className="flex items-center justify-between px-3.5 py-2.5"
            style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}
          >
            <div>
              <div className="text-sm font-semibold">{b.weight} kg</div>
              <div className="text-xs" style={{ color: C.sub2 }}>
                {formatDate(b.date)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditBw(b);
                  setBwWeight(b.weight);
                  setBwDate(b.date);
                  setAddBwOpen(true);
                }}
                className="p-1.5 active:scale-90 transition"
              >
                <Pencil size={14} color={C.sub2} />
              </button>
              <button
                onClick={() => setBodyweights((prev) => prev.filter((x) => x.id !== b.id))}
                className="p-1.5 active:scale-90 transition"
              >
                <Trash2 size={14} color={C.sub2} />
              </button>
            </div>
          </div>
        ))}
        {sortedBw.length === 0 && (
          <div className="text-sm text-center py-6" style={{ color: C.sub2 }}>
            Nicio înregistrare
          </div>
        )}
      </Card>

      {/* Day templates */}
      <div className="flex items-center justify-between mb-2 px-1">
        <SectionLabel>Planuri antrenament</SectionLabel>
        <button onClick={() => setAddPlanOpen(true)} className="text-xs font-semibold mb-2" style={{ color: C.accent }}>
          + Adaugă plan
        </button>
      </div>
      <Card style={{ padding: 4 }} className="mb-6">
        {planNames.map((d, i) => (
          <div
            key={d}
            className="w-full flex items-center justify-between px-3.5 py-3"
            style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}
          >
            <button className="text-left flex-1" onClick={() => setTemplateEditor(d)}>
              <div className="text-sm font-semibold">{d}</div>
              <div className="text-xs" style={{ color: C.sub2 }}>
                {templates[d]?.length || 0} exerciții
              </div>
            </button>
            <button onClick={() => setTemplateEditor(d)} className="p-1.5 active:scale-90 transition">
              <ChevronRight size={16} color={C.sub2} />
            </button>
            <button onClick={() => setConfirmDelPlan(d)} className="p-1.5 active:scale-90 transition">
              <Trash2 size={14} color={C.sub2} />
            </button>
          </div>
        ))}
        {planNames.length === 0 && (
          <div className="text-sm text-center py-6" style={{ color: C.sub2 }}>
            Niciun plan creat
          </div>
        )}
      </Card>

      {/* Exercise list */}
      <div className="flex items-center justify-between mb-2 px-1">
        <SectionLabel>Exerciții</SectionLabel>
        <button onClick={() => setAddExOpen(true)} className="text-xs font-semibold mb-2" style={{ color: C.accent }}>
          + Adaugă
        </button>
      </div>
      <div className="space-y-4 mb-6">
        {grouped.map((g) => (
          <div key={g.group}>
            <div className="text-xs font-medium mb-1.5 px-1" style={{ color: C.sub2 }}>
              {g.group}
            </div>
            <Card style={{ padding: 4 }}>
              {g.items.map((e, i) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between px-3.5 py-2.5"
                  style={{ borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}
                >
                  <span className="text-sm">{e.name}</span>
                  <button onClick={() => setConfirmDelEx(e)} className="p-1 active:scale-90 transition">
                    <Trash2 size={14} color={C.sub2} />
                  </button>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      <button
        onClick={() => setConfirmReset(true)}
        className="w-full rounded-xl py-3 text-sm font-medium mb-4"
        style={{ background: C.dangerSoft, color: C.danger }}
      >
        Resetează toate datele
      </button>

      {/* Template editor sheet */}
      <BottomSheet open={!!templateEditor} onClose={() => setTemplateEditor(null)} title={templateEditor}>
        <div className="space-y-4 pb-4">
          {GROUP_ORDER.map((g) => {
            const items = exercises.filter((e) => e.group === g);
            if (items.length === 0) return null;
            return (
              <div key={g}>
                <div className="text-xs font-medium mb-1.5" style={{ color: C.sub2 }}>
                  {g}
                </div>
                <div className="space-y-1.5">
                  {items.map((e) => {
                    const checked = templates[templateEditor]?.includes(e.id);
                    return (
                      <button
                        key={e.id}
                        onClick={() =>
                          setTemplates((prev) => {
                            const cur = prev[templateEditor] || [];
                            const next = checked ? cur.filter((x) => x !== e.id) : [...cur, e.id];
                            return { ...prev, [templateEditor]: next };
                          })
                        }
                        className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 transition active:scale-95"
                        style={{ background: checked ? C.accentSoft : C.surface2 }}
                      >
                        <span className="text-sm font-medium">{e.name}</span>
                        {checked && <Check size={16} color={C.accent} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </BottomSheet>

      {/* Add exercise sheet */}
      <BottomSheet open={addExOpen} onClose={() => setAddExOpen(false)} title="Exercițiu nou">
        <div className="space-y-3 pb-2">
          <div>
            <div className="text-xs font-medium mb-1.5" style={{ color: C.sub2 }}>
              Nume
            </div>
            <input
              value={newExName}
              onChange={(e) => setNewExName(e.target.value)}
              placeholder="ex: Cable Crossover"
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
              style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}
            />
          </div>
          <div>
            <div className="text-xs font-medium mb-1.5" style={{ color: C.sub2 }}>
              Grupă musculară
            </div>
            <div className="flex flex-wrap gap-1.5">
              {GROUP_ORDER.map((g) => (
                <Chip key={g} active={newExGroup === g} onClick={() => setNewExGroup(g)}>
                  {g}
                </Chip>
              ))}
            </div>
          </div>
          <PrimaryButton onClick={addExercise} disabled={!newExName.trim()}>
            Salvează
          </PrimaryButton>
        </div>
      </BottomSheet>

      {/* Add/edit bodyweight sheet */}
      <BottomSheet
        open={addBwOpen}
        onClose={() => {
          setAddBwOpen(false);
          setEditBw(null);
        }}
        title={editBw ? "Editează greutate" : "Adaugă greutate"}
      >
        <div className="space-y-3 pb-2">
          <div>
            <div className="text-xs font-medium mb-1.5" style={{ color: C.sub2 }}>
              Greutate (kg)
            </div>
            <DecimalField value={bwWeight} onChange={setBwWeight} placeholder="kg" />
          </div>
          <div>
            <div className="text-xs font-medium mb-1.5" style={{ color: C.sub2 }}>
              Data
            </div>
            <input
              type="date"
              value={bwDate}
              onChange={(e) => setBwDate(e.target.value)}
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
              style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}
            />
          </div>
          <PrimaryButton onClick={addBodyweight} disabled={!bwWeight}>
            Salvează
          </PrimaryButton>
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={confirmReset}
        title="Resetezi toate datele?"
        message="Toate antrenamentele, greutățile și exercițiile custom vor fi șterse definitiv."
        confirmLabel="Resetează"
        onCancel={() => setConfirmReset(false)}
        onConfirm={resetAll}
      />

      <ConfirmDialog
        open={!!confirmDelEx}
        title="Ștergi exercițiul?"
        message={confirmDelEx ? `"${confirmDelEx.name}" va fi eliminat din toate planurile.` : ""}
        onCancel={() => setConfirmDelEx(null)}
        onConfirm={() => deleteExercise(confirmDelEx.id)}
      />

      <BottomSheet open={addPlanOpen} onClose={() => setAddPlanOpen(false)} title="Plan nou">
        <div className="space-y-3 pb-2">
          <div>
            <div className="text-xs font-medium mb-1.5" style={{ color: C.sub2 }}>
              Nume plan
            </div>
            <input
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder="ex: Full Body"
              className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
              style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}
            />
          </div>
          <PrimaryButton onClick={addPlan} disabled={!newPlanName.trim() || !!templates[newPlanName.trim()]}>
            Salvează
          </PrimaryButton>
          {newPlanName.trim() && templates[newPlanName.trim()] && (
            <div className="text-xs text-center" style={{ color: C.danger }}>
              Există deja un plan cu acest nume.
            </div>
          )}
        </div>
      </BottomSheet>

      <ConfirmDialog
        open={!!confirmDelPlan}
        title="Ștergi planul?"
        message={confirmDelPlan ? `Planul "${confirmDelPlan}" va fi eliminat. Antrenamentele deja salvate rămân neschimbate.` : ""}
        onCancel={() => setConfirmDelPlan(null)}
        onConfirm={() => deletePlan(confirmDelPlan)}
      />
    </div>
  );
}
