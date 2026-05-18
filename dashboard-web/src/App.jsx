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

  return (
    <div className="min-h-screen bg-[#EEF4FF] flex justify-center p-4">
      <div className="w-full max-w-sm rounded-[32px] bg-white shadow-2xl overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-violet-100 via-pink-100 to-sky-100">
          <div className="flex items-center justify-between">
            <button className="text-2xl text-slate-700">☰</button>

            <div className="text-center">
              <h1 className="text-3xl font-black tracking-widest text-violet-700">
                YAPIAP
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                SMART AI PLANNER
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white">
              🤖
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 pb-28">

          {/* Hero */}
          <div className="rounded-3xl bg-gradient-to-br from-violet-100 via-pink-100 to-sky-100 p-5">

            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-500 text-sm">
                  Good Morning ✨
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-1">
                  Plan your day
                </h2>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      Daily Progress
                    </span>

                    <span className="text-emerald-600 font-bold">
                      73%
                    </span>
                  </div>

                  <div className="h-3 bg-white rounded-full overflow-hidden">
                    <div className="h-full w-[73%] rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400"></div>
                  </div>
                </div>
              </div>

              <div className="text-6xl">
                👾
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-3xl bg-pink-50 p-4 border border-pink-100">
              <p className="text-slate-500 text-sm">
                Calendar
              </p>

              <h3 className="text-2xl font-bold mt-2 text-pink-700">
                12
              </h3>

              <p className="text-sm text-slate-500">
                Tasks planned
              </p>
            </div>

            <div className="rounded-3xl bg-sky-50 p-4 border border-sky-100">
              <p className="text-slate-500 text-sm">
                Improvement
              </p>

              <h3 className="text-2xl font-bold mt-2 text-sky-700">
                +28%
              </h3>

              <p className="text-sm text-slate-500">
                Focus increase
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-50 p-4 border border-emerald-100">
              <p className="text-slate-500 text-sm">
                Progress
              </p>

              <h3 className="text-2xl font-bold mt-2 text-emerald-700">
                73%
              </h3>

              <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full w-[73%] bg-emerald-400 rounded-full"></div>
              </div>
            </div>

            <div className="rounded-3xl bg-violet-50 p-4 border border-violet-100">
              <p className="text-slate-500 text-sm">
                Completed
              </p>

              <h3 className="text-2xl font-bold mt-2 text-violet-700">
                8/12
              </h3>

              <p className="text-sm text-slate-500">
                Tasks completed
              </p>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="rounded-3xl bg-white border border-slate-200 p-4">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-violet-500 text-white flex items-center justify-center text-2xl">
                🤖
              </div>

              <div className="flex-1 bg-violet-50 rounded-2xl p-3">
                <p className="text-slate-700 text-sm">
                  You focused for 2h today. Want me to schedule a break reminder?
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">

              <button className="flex-1 py-3 rounded-2xl bg-violet-500 text-white font-medium">
                Speak
              </button>

              <button className="px-4 rounded-2xl bg-sky-100 text-sky-700">
                Stats
              </button>
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-3xl bg-white border border-slate-200 p-4">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-800">
                  Today's Tasks
                </h3>

                <p className="text-slate-500 text-sm">
                  3 tasks remaining
                </p>
              </div>

              <button className="px-4 py-2 rounded-2xl bg-violet-500 text-white">
                + Add
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">

                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                      task.done
                        ? 'bg-emerald-400 border-emerald-400'
                        : 'border-slate-300'
                    }`}>
                      {task.done ? '✓' : ''}
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-700">
                        {task.title}
                      </h4>

                      <div className={`inline-flex px-2 py-1 rounded-full text-xs mt-1 ${task.color}`}>
                        Task
                      </div>
                    </div>
                  </div>

                  <span className="text-emerald-600 font-semibold text-sm">
                    {task.xp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Devices */}
          <div className="rounded-3xl bg-white border border-slate-200 p-4">

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-slate-800">
                Connected Devices
              </h3>

              <button className="text-violet-600 text-sm">
                Manage
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">

              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-3xl">📱</div>
                <p className="mt-2 text-sm text-slate-700">
                  Phone
                </p>
                <span className="text-xs text-emerald-600">
                  Connected
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-3xl">⌚</div>
                <p className="mt-2 text-sm text-slate-700">
                  Watch
                </p>
                <span className="text-xs text-sky-600">
                  7,842 steps
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-3xl">💻</div>
                <p className="mt-2 text-sm text-slate-700">
                  Laptop
                </p>
                <span className="text-xs text-violet-600">
                  2h focus
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4">
          <div className="w-full max-w-sm px-4">
            <div className="rounded-3xl bg-white border border-slate-200 p-3 flex items-center justify-around shadow-xl">

              <button className="flex flex-col items-center text-violet-600">
                <span className="text-xl">⌂</span>
                <span className="text-xs mt-1">
                  Home
                </span>
              </button>

              <button className="flex flex-col items-center text-slate-400">
                <span className="text-xl">◫</span>
                <span className="text-xs mt-1">
                  Tasks
                </span>
              </button>

              <button className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400 text-white flex items-center justify-center text-2xl -mt-10">
                🎤
              </button>

              <button className="flex flex-col items-center text-slate-400">
                <span className="text-xl">⌁</span>
                <span className="text-xs mt-1">
                  Stats
                </span>
              </button>

              <button className="flex flex-col items-center text-slate-400">
                <span className="text-xl">☺</span>
                <span className="text-xs mt-1">
                  Profile
                </span>
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}