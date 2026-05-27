import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

export default function Chatbot() {
  return (
    <MainLayout title="Chatbot" subtitle="Conversation history and memory">
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <GlassCard title="Conversation" subtitle="AI chat surface">
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl bg-white/5 p-4 text-slate-200">User: Plan my day</div>
            <div className="rounded-2xl bg-violet-500/15 p-4 text-violet-100">AI: I can schedule focus blocks and reminders for you.</div>
            <div className="rounded-2xl bg-white/5 p-4 text-slate-200">User: Start at 9 AM</div>
          </div>
        </GlassCard>

        <GlassCard title="Memory & Uploads" subtitle="Assistive context">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Pinned memory: prefers deep work in the morning</div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">Upload notes, screenshots, and docs here</div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
