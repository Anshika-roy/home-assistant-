import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

const metrics = [
  { label: 'Token usage', value: '82k' },
  { label: 'Automation runs', value: '128' },
  { label: 'AI accuracy', value: '96%' },
]

export default function Analytics() {
  return (
    <MainLayout title="Analytics" subtitle="Usage trends and platform metrics">
      <div className="grid gap-6 xl:grid-cols-3">
        {metrics.map((metric) => (
          <GlassCard key={metric.label} title={metric.label} subtitle="This week">
            <div className="text-4xl font-black text-white">{metric.value}</div>
          </GlassCard>
        ))}
        <GlassCard title="Charts" subtitle="Placeholder canvas" className="xl:col-span-3">
          <div className="grid min-h-[220px] place-items-center rounded-[22px] border border-dashed border-white/10 bg-slate-900/60 text-slate-400">
            Chart area for tokens, tasks, and focus sessions
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
