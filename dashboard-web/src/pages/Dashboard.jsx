import { useEffect, useState } from 'react'
import AIOrb from '../components/AIOrb'
import GlassCard from '../components/GlassCard'
import MainLayout from '../layouts/MainLayout'
import ModuleCard from '../components/ModuleCard'
import { fetchTracks, getTasks } from '../lib/api'

const tasks = [
  { title: 'Study React', xp: '+40 XP', done: true, color: 'bg-violet-100 text-violet-700' },
  { title: 'Workout', xp: '+20 XP', done: false, color: 'bg-emerald-100 text-emerald-700' },
  { title: 'Build YAPIAP', xp: '+60 XP', done: false, color: 'bg-pink-100 text-pink-700' },
]

export default function Dashboard() {
  const [tracksCount, setTracksCount] = useState(null)
  const [tasksCount, setTasksCount] = useState(null)
  const [completedCount, setCompletedCount] = useState(null)
  const [recentTasks, setRecentTasks] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchTracks(100)
      .then((r) => { if (mounted) setTracksCount(Array.isArray(r) ? r.length : 0) })
      .catch(() => { if (mounted) setTracksCount(0) })

    getTasks()
      .then((list) => {
        if (!mounted) return
        const arr = Array.isArray(list) ? list : []
        setTasksCount(arr.length)
        setCompletedCount(arr.filter((t) => t.completed).length)
        setRecentTasks(arr.slice(-3).reverse())
      })
      .catch(() => {
        if (!mounted) return
        setTasksCount(0)
        setCompletedCount(0)
        setRecentTasks([])
      })
    return () => { mounted = false }
  }, [])

  return (
    <MainLayout
      title="Dashboard"
      subtitle="A clean overview of your tasks, progress, and focus"
    >
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <GlassCard title="Daily Overview" subtitle="Progress at a glance">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm text-violet-300">Good Morning ?</div>
                <h3 className="mt-2 text-4xl font-black text-white">Plan your day</h3>
                <p className="mt-3 max-w-xl text-sm text-slate-400">
                  Track tasks, keep your streak alive, and stay in flow with one cockpit.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <AIOrb />
                <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Daily progress</div>
                  <div className="mt-3 text-4xl font-black text-white">73%</div>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ModuleCard icon="📅" title="Calendar" value="12" description="Tasks planned" />
            <ModuleCard icon="⚡" title="Focus" value="+28%" description="Improvement" />
            <ModuleCard icon="🎯" title="Progress" value="73%" description="Daily goal" />
            <ModuleCard icon="🏆" title="Tasks" value={tasksCount === null ? '—' : `${completedCount}/${tasksCount}`} description="Completed / Total" />
          </div>

          <GlassCard title="Today's Tasks" subtitle="3 tasks remaining">
            <div className="space-y-3">
              {(recentTasks || tasks).map((task, i) => {
                const title = task.title || task
                const done = typeof task.completed === 'boolean' ? task.completed : task.done
                const xp = task.xp || (task.completed ? '+0 XP' : '')
                return (
                  <div key={i + title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${done ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-300' : 'border-slate-600 bg-white/5 text-slate-400'}`}>
                        {done ? '✓' : '○'}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{title}</div>
                        <div className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs ${task.color || 'bg-slate-700 text-slate-300'}`}>Task</div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-300">{xp}</div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard title="AI Assistant" subtitle="Suggested next step">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              You focused for 2h today. Want a break reminder or a new goal?
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-2xl bg-violet-500 px-4 py-3 font-semibold text-white">Speak</button>
              <button className="rounded-2xl bg-white/10 px-4 py-3 text-slate-200">Stats</button>
            </div>
          </GlassCard>

          <GlassCard title="Focus Timer" subtitle="Next session: Deep Work">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-5xl font-black text-white">25:00</div>
                <p className="mt-2 text-sm text-slate-400">Ready when you are</p>
              </div>
              <button className="rounded-2xl bg-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400">
                Start
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </MainLayout>
  )
}
