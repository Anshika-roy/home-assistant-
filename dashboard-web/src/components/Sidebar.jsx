import { NavLink } from 'react-router-dom'
import { Bot, CalendarDays, LayoutDashboard, Settings, Sparkles, Workflow, BarChart3, ListTodo, User } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: ListTodo },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/automation', label: 'Automation', icon: Workflow },
  { to: '/chatbot', label: 'Chatbot', icon: Bot },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-[292px] shrink-0 flex-col rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl lg:flex">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-violet-200">
          <Sparkles size={12} />
          AI OS
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-[0.08em] text-white">YAPIAP</h1>
        <p className="mt-2 text-sm text-slate-400">One interface, many modules.</p>
      </div>

      <nav className="mt-8 space-y-2 text-sm">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-2xl border px-4 py-3 transition',
                  isActive
                    ? 'border-violet-400/30 bg-violet-500/15 text-white shadow-lg shadow-violet-500/10'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10',
                ].join(' ')
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto rounded-[24px] border border-white/10 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 p-4">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-300">Today</div>
        <div className="mt-2 text-4xl font-black text-white">73%</div>
        <p className="mt-1 text-sm text-slate-300">Progress completed</p>
      </div>
    </aside>
  )
}
