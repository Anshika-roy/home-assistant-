export default function App() {
  const tasks = [
    {
      title: 'Study React',
      xp: '+40 XP',
      done: true,
      color: 'bg-violet-100 text-violet-700',
    },
    {
      title: 'Workout',
      xp: '+20 XP',
      done: false,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Build YAPIAP',
      xp: '+60 XP',
      done: false,
      color: 'bg-pink-100 text-pink-700',
    },
  ]

  const menu = ['Overview', 'Missions', 'Stats', 'Devices']

  return (
    <div className="min-h-screen bg-[#EEF4FF] p-4 lg:p-8">
      <div className="mx-auto w-full max-w-sm lg:max-w-6xl lg:grid lg:grid-cols-[260px_1fr] lg:gap-6">
        <aside className="hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl lg:block">
          <h1 className="text-3xl font-black tracking-widest text-violet-700">YAPIAP</h1>
          <p className="mt-1 text-xs text-slate-500">SMART AI PLANNER</p>

          <div className="mt-8 space-y-3">
            {menu.map((item, index) => (
              <button
                key={item}
                className={[
                  'w-full rounded-2xl px-4 py-3 text-left font-medium transition',
                  index === 0
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100',
                ].join(' ')}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-violet-100 via-pink-100 to-sky-100 p-4">
            <p className="text-sm text-slate-600">Level</p>
            <p className="mt-1 text-3xl font-bold text-violet-700">17</p>
            <p className="mt-2 text-sm text-slate-600">XP 12,840</p>
          </div>
        </aside>

        <main className="rounded-[32px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
          <header className="border-b border-slate-200 bg-gradient-to-r from-violet-100 via-pink-100 to-sky-100 p-5 lg:px-8">
            <div className="flex items-center justify-between">
              <button className="text-2xl text-slate-700 lg:hidden">☰</button>
              <div className="hidden lg:block" />

              <div className="text-center">
                <h1 className="text-3xl font-black tracking-widest text-violet-700">YAPIAP</h1>
                <p className="mt-1 text-xs text-slate-500">SMART AI PLANNER</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white">
                🤖
              </div>
            </div>
          </header>

          <div className="space-y-4 p-4 pb-28 lg:space-y-5 lg:p-8 lg:pb-8">
            <section className="rounded-3xl bg-gradient-to-br from-violet-100 via-pink-100 to-sky-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Good Morning ✨</p>
                  <h2 className="mt-1 text-3xl font-bold text-slate-800">Plan your day</h2>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-600">Daily Progress</span>
                      <span className="font-bold text-emerald-600">73%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-[73%] rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400" />
                    </div>
                  </div>
                </div>

                <div className="text-6xl">👾</div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard title="Calendar" value="12" subtitle="Tasks planned" tone="pink" />
              <StatCard title="Improvement" value="+28%" subtitle="Focus increase" tone="sky" />
              <StatCard title="Progress" value="73%" subtitle="XP completion" tone="emerald" showBar />
              <StatCard title="Completed" value="8/12" subtitle="Tasks completed" tone="violet" />
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-2xl text-white">🤖</div>
                <div className="flex-1 rounded-2xl bg-violet-50 p-3">
                  <p className="text-sm text-slate-700">
                    You focused for 2h today. Want me to schedule a break reminder?
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-2xl bg-violet-500 py-3 font-medium text-white">Speak</button>
                <button className="rounded-2xl bg-sky-100 px-4 text-sky-700">Stats</button>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Today's Tasks</h3>
                    <p className="text-sm text-slate-500">3 tasks remaining</p>
                  </div>
                  <button className="rounded-2xl bg-violet-500 px-4 py-2 text-white">+ Add</button>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            'flex h-6 w-6 items-center justify-center rounded-lg border',
                            task.done ? 'border-emerald-400 bg-emerald-400' : 'border-slate-300',
                          ].join(' ')}
                        >
                          {task.done ? '✓' : ''}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-700">{task.title}</h4>
                          <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs ${task.color}`}>
                            Task
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">{task.xp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">Connected Devices</h3>
                  <button className="text-sm text-violet-600">Manage</button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center lg:grid-cols-1">
                  <DeviceCard emoji="📱" name="Phone" status="Connected" statusColor="text-emerald-600" />
                  <DeviceCard emoji="⌚" name="Watch" status="7,842 steps" statusColor="text-sky-600" />
                  <DeviceCard emoji="💻" name="Laptop" status="2h focus" statusColor="text-violet-600" />
                </div>
              </div>
            </section>
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 lg:hidden">
            <div className="w-full max-w-sm px-4">
              <div className="flex items-center justify-around rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
                <button className="flex flex-col items-center text-violet-600">
                  <span className="text-xl">⌂</span>
                  <span className="mt-1 text-xs">Home</span>
                </button>

                <button className="flex flex-col items-center text-slate-400">
                  <span className="text-xl">◫</span>
                  <span className="mt-1 text-xs">Tasks</span>
                </button>

                <button className="-mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400 text-2xl text-white">
                  🎤
                </button>

                <button className="flex flex-col items-center text-slate-400">
                  <span className="text-xl">⌁</span>
                  <span className="mt-1 text-xs">Stats</span>
                </button>

                <button className="flex flex-col items-center text-slate-400">
                  <span className="text-xl">☺</span>
                  <span className="mt-1 text-xs">Profile</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function StatCard({ title, value, subtitle, tone, showBar = false }) {
  const toneClasses = {
    pink: 'bg-pink-50 border-pink-100 text-pink-700',
    sky: 'bg-sky-50 border-sky-100 text-sky-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    violet: 'bg-violet-50 border-violet-100 text-violet-700',
  }

  return (
    <div className={`rounded-3xl border p-4 ${toneClasses[tone]}`}>
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
      <p className="text-sm text-slate-500">{subtitle}</p>
      {showBar ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full w-[73%] rounded-full bg-emerald-400" />
        </div>
      ) : null}
    </div>
  )
}

function DeviceCard({ emoji, name, status, statusColor }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-3xl">{emoji}</div>
      <p className="mt-2 text-sm text-slate-700">{name}</p>
      <span className={`text-xs ${statusColor}`}>{status}</span>
    </div>
  )
}