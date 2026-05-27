import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

export default function Profile() {
  return (
    <MainLayout title="Profile" subtitle="Your account, streak, and preferences">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassCard title="User" subtitle="Identity">
          <div className="text-4xl font-black text-white">Anshika</div>
          <p className="mt-2 text-sm text-slate-400">Productivity builder and AI dashboard explorer.</p>
        </GlassCard>

        <GlassCard title="Streak" subtitle="Consistency">
          <div className="text-4xl font-black text-amber-300">14 days</div>
          <p className="mt-2 text-sm text-slate-400">Keep it going with one daily focus session.</p>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
