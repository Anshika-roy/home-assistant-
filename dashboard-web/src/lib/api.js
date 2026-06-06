export const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'

export async function fetchTracks(limit = 10) {
  const res = await fetch(`${API_BASE}/data?limit=${encodeURIComponent(limit)}`)
  if (!res.ok) throw new Error(`fetchTracks failed: ${res.status}`)
  return res.json()
}

export async function postTrack(body) {
  const res = await fetch(`${API_BASE}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`postTrack failed: ${res.status}`)
  return res.json()
}

// Tasks API
export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`)
  if (!res.ok) throw new Error(`getTasks failed: ${res.status}`)
  return res.json()
}

export async function createTask(task) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error(`createTask failed: ${res.status}`)
  return res.json()
}

export async function updateTask(id, patch) {
  const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error(`updateTask failed: ${res.status}`)
  return res.json()
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`deleteTask failed: ${res.status}`)
  return res.json()
}

export async function getGoogleCalendarStatus() {
  const res = await fetch(`${API_BASE}/google-calendar/status`)
  if (!res.ok) throw new Error(`getGoogleCalendarStatus failed: ${res.status}`)
  return res.json()
}

export async function getGoogleCalendarEvents(calendarId = 'primary', maxResults = 10) {
  const params = new URLSearchParams({
    calendarId,
    maxResults: String(maxResults),
  })

  const res = await fetch(`${API_BASE}/google-calendar/events?${params.toString()}`)
  if (!res.ok) throw new Error(`getGoogleCalendarEvents failed: ${res.status}`)
  return res.json()
}

export async function disconnectGoogleCalendar() {
  const res = await fetch(`${API_BASE}/google-calendar/disconnect`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`disconnectGoogleCalendar failed: ${res.status}`)
  return res.json()
}
