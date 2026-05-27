import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

export default function Automation() {
  return (
    <MainLayout title="Automation" subtitle="Workflow builder and integrations">
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <GlassCard title="Triggers" subtitle="Workflow start conditions">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Daily schedule</div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">New task created</div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">AI summary ready</div>
          </div>
        </GlassCard>

        <GlassCard title="Workflow Canvas" subtitle="Drag nodes and connect actions">
          <div className="grid min-h-[260px] grid-cols-2 gap-4 rounded-[22px] border border-dashed border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-violet-400/30 bg-violet-500/15 p-4">Trigger node</div>
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/15 p-4">Action node</div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 p-4">AI step</div>
            <div className="rounded-2xl border border-pink-400/30 bg-pink-500/15 p-4">Webhook step</div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
