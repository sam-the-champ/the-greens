// CarbonTracker.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Leaf, AlertTriangle, Menu, X, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

/* ----------------------------- Types ---------------------------------- */
type WeeklyPoint = { day: string; co2: number };
type Category = {
  id: string;
  name: string;
  valueKg: number;
  color: string;
  goalKg?: number;
};
type Activity = {
  id: string;
  date: string;
  category: string;
  description: string;
  co2Kg: number;
  saved?: boolean;
};

/* ------------------------- Mock / Fetch Helpers ------------------------ */
// Simulated fetch for initial data (replace with your API calls)
async function fetchMockData(): Promise<{
  weekly: WeeklyPoint[];
  categories: Category[];
  activities: Activity[];
}> {
  await new Promise((r) => setTimeout(r, 350)); // simulate latency
  const weekly: WeeklyPoint[] = [
    { day: "Mon", co2: 2.1 },
    { day: "Tue", co2: 1.8 },
    { day: "Wed", co2: 2.6 },
    { day: "Thu", co2: 1.2 },
    { day: "Fri", co2: 3.0 },
    { day: "Sat", co2: 1.1 },
    { day: "Sun", co2: 0.9 },
  ];
  const categories: Category[] = [
    {
      id: "transport",
      name: "Transport",
      valueKg: 8.7,
      color: "#16a34a",
      goalKg: 6,
    },
    { id: "food", name: "Food", valueKg: 4.3, color: "#06b6d4", goalKg: 3 },
    {
      id: "electricity",
      name: "Electricity",
      valueKg: 3.5,
      color: "#facc15",
      goalKg: 4,
    },
    { id: "waste", name: "Waste", valueKg: 1.2, color: "#fb7185", goalKg: 1.5 },
  ];
  const activities: Activity[] = [
    {
      id: "a1",
      date: "2025-10-24",
      category: "Transport",
      description: "Taxi 6km",
      co2Kg: 1.2,
      saved: false,
    },
    {
      id: "a2",
      date: "2025-10-24",
      category: "Food",
      description: "Plant-based meal",
      co2Kg: 0.4,
      saved: true,
    },
    {
      id: "a3",
      date: "2025-10-23",
      category: "Electricity",
      description: "AC 4 hrs",
      co2Kg: 0.9,
      saved: false,
    },
  ];
  return { weekly, categories, activities };
}

/* --------------------------- Small Components -------------------------- */
const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <div className="mb-3">
    <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span
    className="inline-block w-2 h-2 rounded-full mr-2"
    style={{ background: color }}
  />
);

/* -------------------------- Shared UI Pieces --------------------------- */
// Button and Card components follow your dashboard style
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-lg font-medium transition-transform transform hover:scale-105 bg-linear-to-r from-green-400 to-teal-400 shadow-lg text-black ${className}`}
  >
    {children}
  </button>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
  bgGradient?: string;
}

const Card: React.FC<CardProps> = ({ children, className, bgGradient }) => (
  <div
    className={`shadow-lg rounded-xl p-5 ${
      bgGradient || "bg-gray-900"
    } ${className}`}
  >
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b border-gray-700 pb-2 mb-2">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color,
}) => (
  <h3 className={`text-md font-semibold ${color || "text-gray-200"}`}>
    {children}
  </h3>
);

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`text-sm text-gray-300 ${className}`}>{children}</div>
);

/* ----------------------------- Layout --------------------------------- */
/* Sidebar uses same structure/styles as your dashboard shell */
const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({
  isOpen,
  toggle,
}) => (
  <>
    {isOpen && (
      <div
        onClick={toggle}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>
    )}
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed lg:relative top-0 left-0 h-screen w-60 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 p-6 shadow-lg z-50 flex flex-col justify-between shrink-0 rounded-xl overflow-y-auto"
    >
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <Leaf className="text-green-400 w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-100">GreenScore</h1>
          </div>
          <X
            className="text-gray-400 cursor-pointer lg:hidden"
            onClick={toggle}
          />
        </div>

        <Navbar />
      </div>

      <div className="mt-7">
        <img
          src="/let change.jpg"
          alt="visual"
          className="rounded-md w-full object-cover"
        />
      </div>
      <div className="text-xs text-gray-500 text-center">© 2025 GreenScore</div>
    </motion.aside>
  </>
);

/* -------------------------- Carbon Tracker ----------------------------- */

const CarbonTracker: React.FC = () => {
  // state
  const [weekly, setWeekly] = useState<WeeklyPoint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
 
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add form state
  const [form, setForm] = useState({
    category: "Transport",
    co2Kg: "",
    description: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      // Replace with real fetch: const res = await fetch('/api/carbon-data'); const payload = await res.json();
      const payload = await fetchMockData();
      if (!mounted) return;
      setWeekly(payload.weekly);
      setCategories(payload.categories);
      setActivities(payload.activities);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // derived stats
  const totalThisWeek = useMemo(
    () => weekly.reduce((s, p) => s + p.co2, 0),
    [weekly]
  );
 
  const totalCategories = useMemo(
    () => categories.reduce((s, c) => s + c.valueKg, 0),
    [categories]
  );
  const reductionPercent = useMemo(() => {
    const lastWeek = totalThisWeek * 1.12;
    return Math.max(
      0,
      Math.round(((lastWeek - totalThisWeek) / lastWeek) * 100)
    );
  }, [totalThisWeek]);

  // handlers
  const handleAddActivity = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const co2 = parseFloat(form.co2Kg);
    if (Number.isNaN(co2) || !form.description) {
      alert("Enter valid CO₂ value and a short description.");
      return;
    }

    const newAct: Activity = {
      id: `a_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      category: form.category,
      description: form.description,
      co2Kg: co2,
      saved: co2 < 0.5,
    };

    // optimistic UI
    setActivities((s) => [newAct, ...s]);
    setCategories((cats) =>
      cats.map((c) =>
        c.name === form.category
          ? { ...c, valueKg: +(c.valueKg + co2).toFixed(2) }
          : c
      )
    );
    setWeekly((w) => {
      const today = new Date().toLocaleDateString("en-US", {
        weekday: "short",
      });
      const found = w.find((p) => p.day === today);
      if (found)
        return w.map((p) =>
          p.day === today ? { ...p, co2: +(p.co2 + co2).toFixed(2) } : p
        );
      const next = [...w];
      next[next.length - 1].co2 = +(next[next.length - 1].co2 + co2).toFixed(2);
      return next;
    });

    // send to backend placeholder:
    /* try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAct),
      });
    } catch (err) {
      console.error('failed saving activity', err);
    } */

    setForm({ category: "Transport", co2Kg: "", description: "" });
    setAdding(false);
  };

  const handleRemoveActivity = (id: string) => {
    if (!confirm("Delete this activity?")) return;
    setActivities((s) => s.filter((a) => a.id !== id));
    // backend delete placeholder:
    // fetch(`/api/activities/${id}`, { method: 'DELETE' });
  };

  /* --------------------------- Render ---------------------------------- */

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />

      <main className="flex-1 bg-gray-900 p-4 sm:p-6 lg:pl-6 overflow-y-auto min-h-screen">
        {/* Top bar - mobile toggle + title + quick summary */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Menu
              className="text-gray-400 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            />
            <h2 className="text-xl font-bold text-gray-100">Carbon Tracker</h2>
          </div>
          <div className="hidden lg:flex">
            <h2 className="text-xl font-bold text-gray-100">Carbon Tracker</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-400">This week</div>
              <div className="text-lg font-bold">
                {totalThisWeek.toFixed(1)} kg CO₂
              </div>
              <div className="text-xs text-green-400">
                {reductionPercent}% reduction vs last week
              </div>
            </div>

            <button
              onClick={() => setAdding((s) => !s)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-green-500 to-teal-400 text-black px-3 py-2 rounded-lg font-semibold shadow"
            >
              <Plus size={16} /> Add Activity
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: charts & categories (spans 2 on large) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly chart */}
              <div className="bg-gray-850 rounded-xl p-4 shadow-inner border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <SectionTitle
                    title="Weekly Emissions"
                    subtitle="Mon → Sun (kg CO₂)"
                  />
                  <div className="text-sm text-gray-400">
                    Tap bars for details
                  </div>
                </div>

                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weekly}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#111827" vertical={false} />
                      <XAxis dataKey="day" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        wrapperStyle={{
                          background: "#0b1220",
                          borderRadius: 8,
                        }}
                        contentStyle={{ color: "#e5e7eb" }}
                        formatter={(value: number) => [`${value} kg`, "CO₂"]}
                      />
                      <Bar dataKey="co2" radius={[6, 6, 0, 0]} fill="#16a34a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const pct = cat.goalKg
                    ? Math.min(
                        100,
                        Math.round((cat.valueKg / cat.goalKg) * 100)
                      )
                    : 0;
                  return (
                    <div
                      key={cat.id}
                      className="bg-gray-850 rounded-xl p-3 text-center border border-gray-800 flex flex-col items-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            innerRadius="80%"
                            outerRadius="100%"
                            data={[
                              {
                                name: cat.name,
                                value: Math.min(100, pct),
                                fill: cat.color,
                              },
                            ]}
                            startAngle={90}
                            endAngle={-270}
                          >
                            <RadialBar
                              minAngle={5}
                              background
                              dataKey="value"
                              cornerRadius={50}
                              fill={cat.color}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-sm font-medium">{cat.name}</div>
                      <div className="text-xs text-gray-400">
                        {cat.valueKg.toFixed(1)} kg
                      </div>
                      <div className="text-xs mt-1">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-white/5">
                          {cat.goalKg ? `${pct}%` : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right rail: insights + recent */}
            <aside className="space-y-6">
              <div className="bg-gray-850 rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-100">
                    Insights
                  </h4>
                  <div className="text-xs text-gray-400">Auto-generated</div>
                </div>
                <div className="text-sm text-gray-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <Dot color="#16a34a" />
                    <div>
                      <div className="text-sm">
                        Your weekly CO₂ is <b>{reductionPercent}% lower</b> than
                        last week.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Dot color="#06b6d4" />
                    <div>
                      <div className="text-sm">
                        Try taking public transport 2x this week to reduce ~0.8
                        kg.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Dot color="#facc15" />
                    <div className="text-sm">
                      Switching to LED lighting tonight saves energy and CO₂.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-850 rounded-xl p-4 border border-gray-800 max-h-[360px] overflow-auto">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-100">
                    Recent Activities
                  </h4>
                  <div className="text-xs text-gray-400">
                    {activities.length} total
                  </div>
                </div>

                <div className="space-y-2">
                  {activities.slice(0, 6).map((act) => (
                    <motion.div
                      key={act.id}
                      layout
                      className="flex items-center justify-between p-2 rounded-md hover:bg-white/3 transition"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {act.description}
                        </div>
                        <div className="text-xs text-gray-400">
                          {act.date} • {act.category}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          act.saved ? "text-green-400" : "text-gray-200"
                        }`}
                      >
                        {act.co2Kg} kg
                      </div>
                    </motion.div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No activities yet — add one.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Activity Table & right rail controls */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-850 rounded-xl p-4 border border-gray-800 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-100">
                  Activity Log
                </h4>
                <div className="text-xs text-gray-400">Most recent first</div>
              </div>

              <div className="w-full overflow-auto">
                <table className="w-full table-auto text-left text-sm">
                  <thead className="text-xs text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Category</th>
                      <th className="py-2 pr-4">Description</th>
                      <th className="py-2 pr-4">CO₂ (kg)</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((a) => (
                      <tr key={a.id} className="border-b border-gray-800">
                        <td className="py-3 pr-4 text-gray-300">{a.date}</td>
                        <td className="py-3 pr-4 text-gray-200">
                          {a.category}
                        </td>
                        <td className="py-3 pr-4 text-gray-300">
                          {a.description}
                        </td>
                        <td
                          className={`py-3 pr-4 font-semibold ${
                            a.saved ? "text-green-400" : "text-gray-200"
                          }`}
                        >
                          {a.co2Kg}
                        </td>
                        <td className="py-3 pr-4">
                          <button
                            onClick={() => handleRemoveActivity(a.id)}
                            className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-red-600/30 text-red-400"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-850 rounded-xl p-4 border border-gray-800 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" />
                <div>
                  <div className="text-sm font-semibold">
                    High Emission Alert
                  </div>
                  <div className="text-xs text-gray-400">
                    Friday had the highest emissions. Consider alternate
                    transport.
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-100 mb-2">
                  Quick Filters
                </h5>
                <div className="flex flex-wrap gap-2">
                  <button className="px-2 py-1 rounded bg-white/5 text-xs">
                    All
                  </button>
                  <button className="px-2 py-1 rounded bg-white/5 text-xs">
                    Transport
                  </button>
                  <button className="px-2 py-1 rounded bg-white/5 text-xs">
                    Food
                  </button>
                  <button className="px-2 py-1 rounded bg-white/5 text-xs">
                    Electricity
                  </button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-gray-100 mb-2">
                  Connect
                </h5>
                <p className="text-xs text-gray-400">
                  Integrate with your backend to push/pull activities and
                  category goals.
                </p>
                <div className="text-xs mt-2 text-gray-300">
                  Example endpoint placeholders:
                  <div className="break-all text-xs text-gray-400 mt-1">
                    POST /api/activities
                  </div>
                  <div className="break-all text-xs text-gray-400">
                    GET /api/carbon/weekly
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Activity modal */}
          {adding && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setAdding(false)}
              />
              <motion.form
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full max-w-md bg-gray-850 p-4 rounded-xl border border-gray-800 shadow-lg"
                onSubmit={handleAddActivity}
              >
                <h4 className="text-lg font-semibold mb-3">Add Activity</h4>
                <label className="block text-xs text-gray-400 mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, category: e.target.value }))
                  }
                  className="w-full bg-black/30 text-gray-200 rounded px-3 py-2 mb-3"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <label className="block text-xs text-gray-400 mb-1">
                  CO₂ (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.co2Kg}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, co2Kg: e.target.value }))
                  }
                  className="w-full bg-black/30 text-gray-200 rounded px-3 py-2 mb-3"
                  placeholder="0.5"
                />

                <label className="block text-xs text-gray-400 mb-1">
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full bg-black/30 text-gray-200 rounded px-3 py-2 mb-3"
                  placeholder="E.g., Biked to work (3km)"
                />

                <div className="flex items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setAdding(false)}
                    className="px-3 py-2 rounded bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded bg-linear-to-r from-green-500 to-teal-400 text-black font-semibold"
                  >
                    Save Activity
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CarbonTracker;
