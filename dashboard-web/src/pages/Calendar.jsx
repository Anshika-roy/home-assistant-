import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

export default function Calendar() {
  return (
    <MainLayout title="Calendar" subtitle="Schedule sessions and time blocks">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <GlassCard title="Weekly Schedule" subtitle="Time blocks">
          <div className="grid gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
              <div key={day} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <span className="font-semibold text-white">{day}</span>
                <span className="text-sm text-slate-400">{9 + index}:00 - Focus block</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Upcoming" subtitle="Important dates">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Sprint review at 3:00 PM</div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Workout reminder at 6:00 PM</div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Weekly planning on Sunday</div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
