import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, LoaderCircle, RefreshCw, ShieldCheck, LogOut, LogIn } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'
import { API_BASE, disconnectGoogleCalendar, getGoogleCalendarEvents, getGoogleCalendarStatus } from '../lib/api'

const WEEKLY_BLOCKS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const LOCAL_STORAGE_KEY = 'yapiap.googleCalendar.calendarId'
const GOOGLE_OAUTH_START = `${API_BASE || ''}/auth/google/start`

function formatDateTime(value) {
  if (!value) return 'All day'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function buildReturnTo() {
  return `${window.location.origin}${window.location.pathname}`
}

export default function Calendar() {
  const [calendarId, setCalendarId] = useState('primary')
  const [connected, setConnected] = useState(false)
  const [connectedAt, setConnectedAt] = useState(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [events, setEvents] = useState([])
  const [syncError, setSyncError] = useState('')
  const [oauthConfigured, setOauthConfigured] = useState(true)
  const [authQueryHandled, setAuthQueryHandled] = useState(false)

  useEffect(() => {
    try {
      const savedCalendarId = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (savedCalendarId) {
        setCalendarId(savedCalendarId)
      }
    } catch (error) {
      // Ignore storage errors and continue with the default calendar.
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadStatus() {
      try {
        const status = await getGoogleCalendarStatus()
        if (!mounted) return

        setOauthConfigured(!!status.oauthConfigured)
        setConnected(!!status.connected)
        setConnectedAt(status.connectedAt || null)
        if (status.calendarId) {
          setCalendarId(status.calendarId)
        }

        if (status.connected) {
          await loadEvents(status.calendarId || calendarId)
        }

        const searchParams = new URLSearchParams(window.location.search)
        if (searchParams.get('googleConnected') === '1') {
          setAuthQueryHandled(true)
          searchParams.delete('googleConnected')
          const cleaned = searchParams.toString()
          window.history.replaceState({}, '', `${window.location.pathname}${cleaned ? `?${cleaned}` : ''}`)
          await loadEvents(status.calendarId || calendarId)
        }
      } catch (error) {
        if (!mounted) return
        setConnected(false)
        setConnectedAt(null)
        setOauthConfigured(false)
      } finally {
        if (mounted) setLoadingStatus(false)
      }
    }

    async function loadEvents(targetCalendarId = calendarId) {
      try {
        setLoadingEvents(true)
        const response = await getGoogleCalendarEvents(targetCalendarId || 'primary', 8)
        if (!mounted) return
        setEvents(Array.isArray(response.items) ? response.items : [])
        setSyncError('')
      } catch (error) {
        if (!mounted) return
        setEvents([])
        setSyncError(error instanceof Error ? error.message : 'Failed to sync Google Calendar')
      } finally {
        if (mounted) setLoadingEvents(false)
      }
    }

    loadStatus()

    return () => {
      mounted = false
    }
  }, [])

  const upcomingEvents = useMemo(() => {
    if (events.length > 0) {
      return events.map((event) => ({
        id: event.id,
        title: event.summary || 'Untitled event',
        time: formatDateTime(event.start?.dateTime || event.start?.date),
        location: event.location || 'Google Calendar',
      }))
    }

    return [
      { id: 'default-1', title: 'Sprint review', time: 'Today, 3:00 PM', location: 'Team calendar' },
      { id: 'default-2', title: 'Workout reminder', time: 'Today, 6:00 PM', location: 'Personal calendar' },
      { id: 'default-3', title: 'Weekly planning', time: 'Sunday, 9:00 AM', location: 'Planning block' },
    ]
  }, [events])

  async function handleConnect() {
    if (!oauthConfigured) {
      setSyncError('Google OAuth is not configured on the backend. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first.')
      return
    }

    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, calendarId.trim() || 'primary')
      window.location.href = `${GOOGLE_OAUTH_START}?returnTo=${encodeURIComponent(buildReturnTo())}`
    } catch (error) {
      setSyncError('Unable to start Google sign-in.')
    }
  }

  async function handleRefresh() {
    try {
      setLoadingEvents(true)
      window.localStorage.setItem(LOCAL_STORAGE_KEY, calendarId.trim() || 'primary')
      const response = await getGoogleCalendarEvents(calendarId.trim() || 'primary', 8)
      setEvents(Array.isArray(response.items) ? response.items : [])
      setSyncError('')
      setConnected(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh Google Calendar'
      setSyncError(message)
      if (message.includes('401') || message.includes('google_calendar_not_connected')) {
        setConnected(false)
      }
    } finally {
      setLoadingEvents(false)
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectGoogleCalendar()
      setConnected(false)
      setConnectedAt(null)
      setEvents([])
      setSyncError('')
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Failed to disconnect Google Calendar')
    }
  }

  return (
    <MainLayout title="Calendar" subtitle="Connect Google Calendar and sync your private events">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <GlassCard title="Google Calendar" subtitle="Sign in and sync private events" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span className="block text-xs uppercase tracking-[0.28em] text-slate-400">Calendar ID</span>
              <input
                value={calendarId}
                onChange={(event) => setCalendarId(event.target.value)}
                placeholder="primary"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConnect}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-400"
              >
                <LogIn size={16} />
                Sign in with Google
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loadingEvents || !connected}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingEvents ? <LoaderCircle className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                Refresh events
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                disabled={!connected}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
            Sign in with your Google account to allow the app to read your private calendar through the backend OAuth flow.
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            {loadingStatus
              ? 'Checking connection status...'
              : connected
                ? `Connected${connectedAt ? ` since ${new Date(connectedAt).toLocaleString()}` : ''}`
                : 'Not connected yet'}
          </div>

          {!oauthConfigured ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              Google OAuth is not configured on the backend. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.
            </div>
          ) : null}

          {authQueryHandled ? (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              Google sign-in completed. Syncing your calendar now...
            </div>
          ) : null}

          {syncError ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
              {syncError}
            </div>
          ) : null}

          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-slate-400">
            <ShieldCheck size={14} />
            OAuth-backed calendar access
          </div>
        </GlassCard>

        <GlassCard title="Upcoming" subtitle="Synced events and time blocks">
          <div className="space-y-3 text-sm text-slate-300">
            {upcomingEvents.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="mt-1 text-slate-400">{item.time}</div>
                  </div>
                  <ExternalLink size={16} className="mt-1 shrink-0 text-slate-500" />
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-400">{item.location}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Weekly Schedule" subtitle="Time blocks" className="xl:col-span-2">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {WEEKLY_BLOCKS.map((day, index) => (
              <div key={day} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="font-semibold text-white">{day}</div>
                <div className="mt-2 text-sm text-slate-400">{9 + index}:00 - Focus block</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
}