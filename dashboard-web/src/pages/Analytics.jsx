import { useEffect, useMemo, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'
import { fetchTracks, getTasks } from '../lib/api'

function formatCount(value) {
  if (value >= 1000) {
    return `${Math.round(value / 100) / 10}k`
  }

  return String(value)
}

export default function Analytics() {
  const [tracks, setTracks] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartMode, setChartMode] = useState('activity')

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const [trackData, taskData] = await Promise.all([fetchTracks(200), getTasks()])

        if (!mounted) return
        setTracks(Array.isArray(trackData) ? trackData : [])
        setTasks(Array.isArray(taskData) ? taskData : [])
      } catch (error) {
        if (!mounted) return
        setTracks([])
        setTasks([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const metrics = useMemo(() => {
    const completedTasks = tasks.filter((task) => task.completed).length
    const openTasks = Math.max(tasks.length - completedTasks, 0)
    const uniqueDevices = new Set(tracks.map((track) => track.deviceType).filter(Boolean)).size
    const recentTracks = tracks.slice(-10)

    return [
      {
        label: 'Tracks captured',
        value: formatCount(tracks.length),
        detail: tracks.length === 0 ? 'No activity yet' : 'Incoming telemetry',
      },
      {
        label: 'Tasks completed',
        value: formatCount(completedTasks),
        detail: openTasks === 0 ? 'No open tasks' : `${formatCount(openTasks)} open tasks`,
      },
      {
        label: 'Devices active',
        value: formatCount(uniqueDevices),
        detail: uniqueDevices === 0 ? 'Waiting for device data' : 'Tracked device types',
      },
      {
        label: 'Recent activity',
        value: formatCount(recentTracks.length),
        detail: recentTracks.length === 0 ? 'Nothing recorded yet' : 'Last 10 track events',
      },
    ]
  }, [tasks, tracks])

  const deviceCounts = useMemo(() => {
    const counts = tracks.reduce((acc, track) => {
      const key = track.deviceType || 'unknown'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)
  }, [tracks])

  const totalTasks = tasks.length || 1
  const completionRate = tasks.length === 0 ? 0 : Math.round((tasks.filter((task) => task.completed).length / totalTasks) * 100)

  const chartData = useMemo(() => {
    if (chartMode === 'devices') {
      return deviceCounts.map((item) => ({ label: item.device, value: item.count }))
    }

    if (chartMode === 'tasks') {
      return [
        { label: 'Completed', value: tasks.filter((task) => task.completed).length },
        { label: 'Open', value: Math.max(tasks.length - tasks.filter((task) => task.completed).length, 0) },
      ]
    }

    const lastTen = tracks.slice(-10)
    return lastTen.length > 0
      ? lastTen.map((track, index) => ({
          label: track.deviceType || `Item ${index + 1}`,
          value: index + 1,
        }))
      : [{ label: 'No activity', value: 0 }]
  }, [chartMode, deviceCounts, tasks, tracks])

  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1)
  const chartHeight = 220
  const chartWidth = 640
  const barGap = 14
  const barWidth = Math.min(Math.max((chartWidth - barGap * (chartData.length - 1)) / chartData.length, 22), 34)

  return (
    <MainLayout title="Analytics" subtitle="Live usage totals from your tracks and tasks data">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-1 lg:col-span-1">
          {metrics.map((metric) => (
            <GlassCard key={metric.label} className="p-3" title="" subtitle="">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
              <div className="mt-2 text-2xl font-black text-white">{loading ? '—' : metric.value}</div>
              <div className="mt-1 text-xs text-slate-400">{metric.detail}</div>
            </GlassCard>
          ))}
        </div>

        <GlassCard title="Activity breakdown" subtitle="Derived from live data" className="xl:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { id: 'activity', label: 'Activity' },
              { id: 'devices', label: 'Devices' },
              { id: 'tasks', label: 'Tasks' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setChartMode(mode.id)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  chartMode === mode.id
                    ? 'border-violet-400/30 bg-violet-500/15 text-white'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[22px] border border-white/10 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>
                  {chartMode === 'activity' && 'Recent activity'}
                  {chartMode === 'devices' && 'Device distribution'}
                  {chartMode === 'tasks' && 'Task status'}
                </span>
                <span className="font-semibold text-white">
                  {chartMode === 'tasks' ? `${completionRate}% complete` : `${formatCount(maxChartValue)} peak`}
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-slate-950/40 p-4">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-[260px] w-full" role="img" aria-label={`${chartMode} analytics chart`}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1={chartHeight - 24} x2={chartWidth} y2={chartHeight - 24} stroke="rgba(255,255,255,0.12)" />

                  {chartData.map((item, index) => {
                    const x = index * (barWidth + barGap)
                    const height = chartMode === 'activity' ? 120 : Math.max((item.value / maxChartValue) * 110, item.value > 0 ? 22 : 8)
                    const y = chartHeight - 24 - height
                    const width = barWidth

                    if (chartMode === 'activity') {
                      const pointY = chartHeight - 24 - ((item.value / maxChartValue) * 110 || 12)
                      const nextItem = chartData[index + 1]
                      const nextX = nextItem ? x + barWidth + barGap : x
                      const nextY = nextItem ? chartHeight - 24 - ((nextItem.value / maxChartValue) * 110 || 12) : pointY

                      return (
                        <g key={`${item.label}-${index}`}>
                          <circle cx={x + width / 2} cy={pointY} r="6" fill="url(#chartGradient)" />
                          {nextItem ? (
                            <line
                              x1={x + width / 2}
                              y1={pointY}
                              x2={nextX + width / 2}
                              y2={nextY}
                              stroke="url(#chartGradient)"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          ) : null}
                          <text x={x + width / 2} y={chartHeight - 4} textAnchor="middle" fill="rgba(226,232,240,0.8)" fontSize="11">
                            {item.label}
                          </text>
                        </g>
                      )
                    }

                    return (
                      <g key={`${item.label}-${index}`}>
                        <rect x={x} y={y} width={width} height={height} rx="16" fill="url(#chartGradient)" opacity="0.92" />
                        <text x={x + width / 2} y={y - 8} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
                          {item.value}
                        </text>
                        <text x={x + width / 2} y={chartHeight - 4} textAnchor="middle" fill="rgba(226,232,240,0.8)" fontSize="11">
                          {item.label}
                        </text>
                      </g>
                    )
                  })}

                  {chartMode === 'tasks' ? (
                    <g>
                      <rect x="40" y="40" width="200" height="22" rx="11" fill="rgba(255,255,255,0.08)" />
                      <rect x="40" y="40" width={`${completionRate}%`} height="22" rx="11" fill="url(#chartGradient)" />
                    </g>
                  ) : null}
                </svg>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                {chartMode === 'activity' && <span>Shows the latest track events in order.</span>}
                {chartMode === 'devices' && <span>Shows the count of each device type observed.</span>}
                {chartMode === 'tasks' && <span>Shows completed versus open tasks from the live board.</span>}
              </div>

              <div className="mt-5 space-y-3">
                {(deviceCounts.length > 0 ? deviceCounts : [{ device: 'No devices yet', count: 0 }]).map((item) => (
                  <div key={item.device} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <span className="text-slate-300">{item.device}</span>
                    <span className="font-semibold text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-slate-900/60 p-4">
              <div className="text-sm uppercase tracking-[0.28em] text-slate-400">What is shown</div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Tracks captured from the backend telemetry stream.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Tasks completed versus tasks still open.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Device types observed in recent track data.</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}
