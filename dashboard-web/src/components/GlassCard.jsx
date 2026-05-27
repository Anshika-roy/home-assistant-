export default function GlassCard({ title, subtitle, children, className = '' }) {
  return (
    <section className={`rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}
