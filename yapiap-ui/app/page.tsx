"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChartNoAxesCombined,
  Home,
  ListChecks,
  Medal,
  Shield,
  TimerReset,
  Trophy,
} from "lucide-react";

const quests = [
  { title: "Master TypeScript", xp: "+2000 XP", color: "border-fuchsia-400/70" },
  { title: "Run a 5K", xp: "+1000 XP", color: "border-emerald-400/70" },
  { title: "Build a Robot", xp: "+5000 XP", color: "border-amber-400/70" },
];

const stats = [
  { label: "Current Streak", value: "11 days", icon: Medal },
  { label: "XP Earned", value: "12,480", icon: Trophy },
  { label: "Focus Time", value: "2h 45m", icon: TimerReset },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 text-white sm:px-8 sm:py-8">
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-44 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="glass glow relative rounded-3xl p-5 sm:p-6">
          <div className="mb-8">
            <p className="font-ui text-xs tracking-[0.32em] text-fuchsia-200/80">LEVEL 17</p>
            <h1 className="font-ui mt-2 text-3xl text-fuchsia-300">YAPIAP</h1>
            <p className="mt-2 text-sm text-violet-100/80">Quest your way through your day.</p>
          </div>

          <nav className="space-y-3">
            <SideButton label="Home" Icon={Home} active />
            <SideButton label="Missions" Icon={ListChecks} />
            <SideButton label="Stats" Icon={ChartNoAxesCombined} />
            <SideButton label="Rewards" Icon={Trophy} />
          </nav>

          <motion.div
            className="glass mt-8 rounded-2xl p-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-fuchsia-200/70">Mascot</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/80 to-indigo-500/80 text-xl">
                ^_^
              </div>
              <p className="text-sm text-violet-100/90">Your companion is energized.</p>
            </div>
          </motion.div>
        </aside>

        <main className="space-y-5">
          <motion.section
            className="glass glow rounded-3xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-ui text-xs uppercase tracking-[0.32em] text-cyan-100/70">Daily Progress</p>
                <h2 className="font-title mt-3 text-4xl leading-tight text-white sm:text-5xl">Today&apos;s a New Day</h2>
                <p className="mt-3 text-sm text-slate-200/90 sm:text-base">
                  Complete quests, stack your streak, and unlock the next rank.
                </p>
              </div>
              <button className="glass rounded-xl p-3 hover:bg-white/15" aria-label="Notifications">
                <Bell className="h-5 w-5 text-fuchsia-300" />
              </button>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-violet-100/70">
                <span>73% completed</span>
                <span>11 / 15 tasks</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "73%" }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <motion.article
                key={label}
                className="glass rounded-2xl p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.12 }}
              >
                <div className="flex items-center gap-3 text-fuchsia-200">
                  <Icon className="h-5 w-5" />
                  <p className="text-sm text-violet-100/80">{label}</p>
                </div>
                <p className="font-ui mt-3 text-2xl text-white">{value}</p>
              </motion.article>
            ))}
          </section>

          <section className="glass rounded-3xl p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="font-ui text-2xl text-fuchsia-200">Quest Board</h3>
              <span className="rounded-full border border-fuchsia-300/35 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-100">
                3 active quests
              </span>
            </div>

            <div className="space-y-3">
              {quests.map((quest, index) => (
                <motion.article
                  key={quest.title}
                  className={`rounded-2xl border ${quest.color} bg-white/5 p-4 sm:p-5`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.12 }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-100 sm:text-xl">{quest.title}</h4>
                      <p className="mt-1 text-sm text-violet-200/90">Reward: {quest.xp}</p>
                    </div>
                    <button className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 font-medium text-white transition hover:brightness-110">
                      Accept Quest
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="glass rounded-3xl p-5">
            <div className="flex items-center gap-3 text-cyan-200">
              <Shield className="h-5 w-5" />
              <p className="text-sm text-slate-200/90">System Tip: Keep session focus blocks under 50 minutes for max XP gain.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

type SideButtonProps = {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

function SideButton({ label, Icon, active = false }: SideButtonProps) {
  return (
    <button
      className={[
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
        active
          ? "bg-fuchsia-500/20 text-fuchsia-100 shadow-[0_0_30px_rgba(157,78,221,0.22)]"
          : "bg-white/5 text-slate-200 hover:bg-white/12",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      <span className="font-ui text-sm tracking-wide">{label}</span>
    </button>
  );
}
