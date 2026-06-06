import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'
import { getTasks, createTask, updateTask, deleteTask } from '../lib/api'

const COLUMN_ORDER = ['Backlog', 'In Progress', 'Done']

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newColumn, setNewColumn] = useState('Backlog')

  async function loadTasks() {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load tasks', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const created = await createTask({ title: newTitle.trim(), column: newColumn })
      setNewTitle('')
      setNewColumn('Backlog')
      setTasks((s) => [...s, created])
    } catch (err) {
      console.error('createTask failed', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id)
      setTasks((s) => s.filter((t) => t.id !== id))
    } catch (err) {
      console.error('deleteTask failed', err)
    }
  }

  async function handleToggleComplete(task) {
    try {
      const updated = await updateTask(task.id, { completed: !task.completed })
      setTasks((s) => s.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      console.error('updateTask failed', err)
    }
  }

  const grouped = COLUMN_ORDER.map((col) => ({
    title: col,
    items: tasks.filter((t) => t.column === col),
  }))

  return (
    <MainLayout title="Tasks" subtitle="Your productivity board and quest list">
      <div className="space-y-6">
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            className="flex-1 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200"
            placeholder="New task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-slate-200"
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
          >
            {COLUMN_ORDER.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white">Add</button>
        </form>

        <div className="grid gap-6 xl:grid-cols-3">
          {grouped.map((column) => (
            <GlassCard key={column.title} title={column.title} subtitle="Kanban lane">
              <div className="space-y-3">
                {loading && <div className="text-sm text-slate-400">Loading...</div>}
                {column.items.length === 0 && !loading && (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">No tasks</div>
                )}
                {column.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                    <div className="flex items-center gap-4">
                      <label className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.completed ? 'border-emerald-400/60 bg-emerald-400/15 text-emerald-300' : 'border-slate-600 bg-white/5 text-slate-400'}`}>
                        <input type="checkbox" checked={!!item.completed} onChange={() => handleToggleComplete(item)} />
                      </label>
                      <div>
                        <div className={`font-semibold ${item.completed ? 'text-slate-400 line-through' : 'text-white'}`}>{item.title}</div>
                        <div className="mt-1 text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(item.id)} className="rounded-2xl bg-white/5 px-3 py-1 text-xs text-slate-200">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
