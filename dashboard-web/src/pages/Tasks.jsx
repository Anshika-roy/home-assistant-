import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

const columns = [
  { title: 'Backlog', items: ['Design automation flow', 'Review analytics UI'] },
  { title: 'In Progress', items: ['Build tasks board', 'Wire up sidebar navigation'] },
  { title: 'Done', items: ['Create router architecture', 'Restore dashboard styling'] },
]

export default function Tasks() {
  return (
    <MainLayout title="Tasks" subtitle="Your productivity board and quest list">
      <div className="grid gap-6 xl:grid-cols-3">
        {columns.map((column) => (
          <GlassCard key={column.title} title={column.title} subtitle="Kanban lane">
            <div className="space-y-3">
              {column.items.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </MainLayout>
  )
}
