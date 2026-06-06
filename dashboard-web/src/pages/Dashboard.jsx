import { useEffect, useState } from 'react'
import AIOrb from '../components/AIOrb'
import GlassCard from '../components/GlassCard'
import MainLayout from '../layouts/MainLayout'
import ModuleCard from '../components/ModuleCard'
import { getDashboardData, toggleTask } from '../lib/api'

const fallbackTasks = [
  { title: 'Study React', xp: '+40 XP', done: true, color: 'bg-violet-100 text-violet-700' },
  { title: 'Workout', xp: '+20 XP', done: false, color: 'bg-emerald-100 text-emerald-700' },
  { title: 'Build YAPIAP', xp: '+60 XP', done: false, color: 'bg-pink-100 text-pink-700' },
]

export default function Dashboard() {
  const [tracksCount, setTracksCount] = useState(0)
  const [tasksCount, setTasksCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [secondsLeft, setSecondsLeft] = useState(1500)
  const [running, setRunning] = useState(false)

  const loadDashboard = async () => {
    try {
      const { tracks, tasks } = await getDashboardData()

      const trackArr = Array.isArray(tracks) ? tracks : []
      const taskArr = Array.isArray(tasks) ? tasks : []

      const completed = taskArr.filter((t) => t.completed).length

      const sortedTasks = [...taskArr]
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime()
        )
        .slice(0, 3)

      setTracksCount(trackArr.length)
      setTasksCount(taskArr.length)
      setCompletedCount(completed)
      setRecentTasks(sortedTasks)
    } catch (err) {
      console.error(err)
      setTracksCount(0)
      setTasksCount(0)
      setCompletedCount(0)
      setRecentTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    if (!running) return

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false)

          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            window.speechSynthesis.speak(
              new SpeechSynthesisUtterance('Focus session complete')
            )
          }

          return 1500
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [running])

  const progress =
    tasksCount > 0 ? Math.round((completedCount / tasksCount) * 100) : 0

  const remainingTasks = Math.max(tasksCount - completedCount, 0)

  const currentHour = new Date().getHours()

  const greeting =
    currentHour < 12
      ? 'Good Morning'
      : currentHour < 18
        ? 'Good Afternoon'
        : 'Good Evening'

  const speakSummary = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(
      `You have completed ${completedCount} out of ${tasksCount} tasks today.`
    )

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const showStats = () => {
    alert(
      `Tasks Completed: ${completedCount}/${tasksCount}\nProgress: ${progress}%\nTracks: ${tracksCount}`
    )
  }

  const handleTaskToggle = async (task) => {
    if (!task.id) return

    try {
      await toggleTask(task.id, !!task.completed)
      await loadDashboard()
    } catch (err) {
      console.error(err)
    }
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

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
                <div className="text-sm text-violet-300">{greeting}</div>

                <h3 className="mt-2 text-4xl font-black text-white">
                  Plan your day
                </h3>

                <p className="mt-3 max-w-xl text-sm text-slate-400">
                  Track tasks, keep your streak alive, and stay in flow with one cockpit.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <AIOrb />

                <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Daily progress
                  </div>

                  <div className="mt-3 text-4xl font-black text-white">
                    {progress}%
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ModuleCard
              icon="📅"
              title="Tasks Left"
              value={remainingTasks}
              description="Remaining today"
            />

            <ModuleCard
              icon="⚡"
              title="Tracks"
              value={tracksCount}
              description="Activity records"
            />

            <ModuleCard
              icon="🎯"
              title="Progress"
              value={`${progress}%`}
              description="Completion rate"
            />

            <ModuleCard
              icon="🏆"
              title="Tasks"
              value={loading ? '—' : `${completedCount}/${tasksCount}`}
              description="Completed / Total"
            />
          </div>

          <GlassCard title="Today's Tasks" subtitle={`${remainingTasks} tasks remaining`}>
            <div className="space-y-3">
              {(recentTasks.length ? recentTasks : fallbackTasks).map((task, i) => {
                const title = task.title || `Task ${i + 1}`

                const done =
                  typeof task.completed === 'boolean'
                    ? task.completed
                    : !!task.done

                const xp = task.xp || (done ? '+10 XP' : '+0 XP')

                return (
                  <div
                    key={task.id || `${i}-${title}`}
                    onClick={() => task.id && handleTaskToggle(task)}
                    className={`flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4 ${
                      task.id ? 'cursor-pointer transition hover:bg-slate-800/70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                          done
                            ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-300'
                            : 'border-slate-600 bg-white/5 text-slate-400'
                        }`}
                      >
                        {done ? '✓' : '○'}
                      </div>

                      <div>
                        <div className="font-semibold text-white">{title}</div>

                        <div
                          className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs ${
                            task.color || 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          Task
                        </div>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-emerald-300">
                      {xp}
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard title="AI Assistant" subtitle="Suggested next step">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              You have completed {completedCount} of {tasksCount} tasks today.
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={speakSummary}
                className="flex-1 rounded-2xl bg-violet-500 px-4 py-3 font-semibold text-white"
              >
                Speak
              </button>

              <button
                onClick={showStats}
                className="rounded-2xl bg-white/10 px-4 py-3 text-slate-200"
              >
                Stats
              </button>
            </div>
          </GlassCard>

          <GlassCard title="Focus Timer" subtitle="Next session: Deep Work">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-5xl font-black text-white">
                  {minutes}:{seconds}
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Ready when you are
                </p>
              </div>

              <button
                onClick={() => setRunning((v) => !v)}
                className="rounded-2xl bg-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400"
              >
                {running ? 'Pause' : 'Start'}
              </button>
            </div>
          </GlassCard>
        </div>
      </section>
    </MainLayout>
  )
}