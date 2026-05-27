export default function ModuleCard({ icon, title, value, description }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="text-2xl">{icon}</div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{title}</div>
          <div className="mt-2 text-2xl font-black text-white">{value}</div>
        </div>
      </div>
      {description ? <p className="mt-3 text-sm text-slate-400">{description}</p> : null}
    </div>
  )
}
