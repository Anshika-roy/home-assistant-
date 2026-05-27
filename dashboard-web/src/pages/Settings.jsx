import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

export default function Settings() {
  return (
    <MainLayout title="Settings" subtitle="Preferences and app controls">
      <GlassCard title="Appearance" subtitle="Theme and layout">
        <div className="space-y-3 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Dark glass theme</div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Desktop layout enabled</div>
        </div>
      </GlassCard>
    </MainLayout>
  )
}
