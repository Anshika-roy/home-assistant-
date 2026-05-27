import { Bell, Menu } from 'lucide-react'

export default function Topbar({ title, subtitle }) {
  return (
    <header className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <button className="xl:hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
          <Menu size={20} />
        </button>

        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-violet-300">YAPIAP</div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white xl:text-5xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">{subtitle}</p>
        </div>

        <button className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white">
          <Bell size={20} />
        </button>
      </div>
    </header>
  )
}
