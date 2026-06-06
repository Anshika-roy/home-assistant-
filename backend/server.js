const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'tracks.json')
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json')
const GOOGLE_CALENDAR_FILE = path.join(DATA_DIR, 'google-calendar.json')

const SUPPORTED_DEVICES = ['phone', 'laptop', 'watch']
const GOOGLE_SCOPE = 'openid profile email https://www.googleapis.com/auth/calendar.readonly'
const DEFAULT_CALENDAR_ID = 'primary'
const DEFAULT_RETURN_TO = 'http://localhost:5173/calendar'

function getAllowedReturnOrigins() {
  const configured = process.env.GOOGLE_ALLOWED_RETURN_TO_ORIGINS || process.env.FRONTEND_URL || ''
  const origins = configured
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  return ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173', ...origins]
}

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(DATA_FILE).catch(async () => {
      await fs.writeFile(DATA_FILE, JSON.stringify([]), { encoding: 'utf8' })
    })
  } catch (err) {
    console.error('Failed to ensure data file:', err)
    throw err
  }
}

async function readAll() {
  try {
    await ensureDataFile()
    const raw = await fs.readFile(DATA_FILE, { encoding: 'utf8' })
    return JSON.parse(raw || '[]')
  } catch (err) {
    console.error('readAll error:', err)
    return []
  }
}

async function writeAll(data) {
  const tmp = DATA_FILE + '.tmp'
  const str = JSON.stringify(data, null, 2)
  await fs.writeFile(tmp, str, { encoding: 'utf8' })
  await fs.rename(tmp, DATA_FILE)
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function validateTrackBody(body) {
  if (!body || typeof body !== 'object') return 'body must be a JSON object'
  const { deviceType, deviceId, payload, timestamp } = body
  if (!deviceType || typeof deviceType !== 'string') return 'deviceType is required'
  if (!SUPPORTED_DEVICES.includes(deviceType)) return `deviceType must be one of: ${SUPPORTED_DEVICES.join(', ')}`
  if (deviceId && typeof deviceId !== 'string') return 'deviceId must be a string when provided'
  if (!payload || typeof payload !== 'object') return 'payload (object) is required'
  if (timestamp && isNaN(Date.parse(timestamp))) return 'timestamp must be an ISO date string if provided'
  return null
}

app.post('/track', async (req, res) => {
  try {
    const err = validateTrackBody(req.body)
    if (err) return res.status(400).json({ success: false, error: err })

    const stored = await readAll()
    const entry = {
      id: makeId(),
      deviceType: req.body.deviceType,
      deviceId: req.body.deviceId || null,
      payload: req.body.payload,
      receivedAt: new Date().toISOString(),
      timestamp: req.body.timestamp ? new Date(req.body.timestamp).toISOString() : null,
    }

    stored.push(entry)
    await writeAll(stored)

    console.log('Stored track:', entry.id, entry.deviceType, entry.deviceId || '-')
    return res.status(201).json({ success: true, id: entry.id })
  } catch (err) {
    console.error('/track error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

app.get('/data', async (req, res) => {
  try {
    let all = await readAll()
    const { deviceType, limit } = req.query
    if (deviceType) {
      all = all.filter((d) => d.deviceType === deviceType)
    }
    const lim = parseInt(limit, 10)
    if (!isNaN(lim) && lim > 0) all = all.slice(-lim)
    return res.json(all)
  } catch (err) {
    console.error('/data error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

async function ensureTasksFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(TASKS_FILE).catch(async () => {
      await fs.writeFile(TASKS_FILE, JSON.stringify([]), { encoding: 'utf8' })
    })
  } catch (err) {
    console.error('Failed to ensure tasks file:', err)
    throw err
  }
}

async function readTasks() {
  try {
    await ensureTasksFile()
    const raw = await fs.readFile(TASKS_FILE, { encoding: 'utf8' })
    return JSON.parse(raw || '[]')
  } catch (err) {
    console.error('readTasks error:', err)
    return []
  }
}

async function writeTasks(data) {
  const tmp = TASKS_FILE + '.tmp'
  const str = JSON.stringify(data, null, 2)
  await fs.writeFile(tmp, str, { encoding: 'utf8' })
  await fs.rename(tmp, TASKS_FILE)
}

function validateTaskBody(body, isUpdate = false) {
  if (!body || typeof body !== 'object') return 'body must be a JSON object'
  if (!isUpdate) {
    if (!body.title || typeof body.title !== 'string') return 'title (string) is required'
    if (!body.column || typeof body.column !== 'string') return 'column (string) is required'
  } else {
    if (body.title && typeof body.title !== 'string') return 'title must be a string'
    if (body.column && typeof body.column !== 'string') return 'column must be a string'
    if (body.completed !== undefined && typeof body.completed !== 'boolean') return 'completed must be boolean'
  }
  return null
}

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await readTasks()
    return res.json(tasks)
  } catch (err) {
    console.error('/tasks GET error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

app.post('/tasks', async (req, res) => {
  try {
    const err = validateTaskBody(req.body, false)
    if (err) return res.status(400).json({ success: false, error: err })

    const tasks = await readTasks()
    const now = new Date().toISOString()
    const task = {
      id: makeId(),
      title: req.body.title,
      column: req.body.column,
      completed: !!req.body.completed,
      createdAt: now,
      updatedAt: now,
    }

    tasks.push(task)
    await writeTasks(tasks)

    return res.status(201).json(task)
  } catch (err) {
    console.error('/tasks POST error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

app.put('/tasks/:id', async (req, res) => {
  try {
    const err = validateTaskBody(req.body, true)
    if (err) return res.status(400).json({ success: false, error: err })

    const tasks = await readTasks()
    const idx = tasks.findIndex((t) => t.id === req.params.id)
    if (idx === -1) return res.status(404).json({ success: false, error: 'not_found' })

    const updated = Object.assign({}, tasks[idx], req.body, { updatedAt: new Date().toISOString() })
    tasks[idx] = updated
    await writeTasks(tasks)

    return res.json(updated)
  } catch (err) {
    console.error('/tasks PUT error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

app.delete('/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks()
    const idx = tasks.findIndex((t) => t.id === req.params.id)
    if (idx === -1) return res.status(404).json({ success: false, error: 'not_found' })

    const removed = tasks.splice(idx, 1)[0]
    await writeTasks(tasks)
    return res.json({ success: true, id: removed.id })
  } catch (err) {
    console.error('/tasks DELETE error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

async function ensureGoogleCalendarFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(GOOGLE_CALENDAR_FILE).catch(async () => {
      await fs.writeFile(
        GOOGLE_CALENDAR_FILE,
        JSON.stringify({ connected: false, calendarId: DEFAULT_CALENDAR_ID, tokens: null }, null, 2),
        { encoding: 'utf8' }
      )
    })
  } catch (err) {
    console.error('Failed to ensure google calendar file:', err)
    throw err
  }
}

async function readGoogleCalendarState() {
  try {
    await ensureGoogleCalendarFile()
    const raw = await fs.readFile(GOOGLE_CALENDAR_FILE, { encoding: 'utf8' })
    return JSON.parse(raw || '{}')
  } catch (err) {
    console.error('readGoogleCalendarState error:', err)
    return { connected: false, calendarId: DEFAULT_CALENDAR_ID, tokens: null }
  }
}

async function writeGoogleCalendarState(state) {
  const tmp = GOOGLE_CALENDAR_FILE + '.tmp'
  const str = JSON.stringify(state, null, 2)
  await fs.writeFile(tmp, str, { encoding: 'utf8' })
  await fs.rename(tmp, GOOGLE_CALENDAR_FILE)
}

function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'

  if (!clientId || !clientSecret) {
    return null
  }

  return { clientId, clientSecret, redirectUri }
}

function isGoogleOAuthConfigured() {
  return !!getGoogleOAuthConfig()
}

function buildGoogleAuthUrl({ state }) {
  const config = getGoogleOAuthConfig()
  if (!config) {
    throw new Error('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.')
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

function safeReturnTo(input) {
  if (!input) return DEFAULT_RETURN_TO

  try {
    const parsed = new URL(input)
    const allowedOrigins = new Set(getAllowedReturnOrigins())
    if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && allowedOrigins.has(parsed.origin)) {
      return parsed.toString()
    }
  } catch (err) {
    if (typeof input === 'string' && input.startsWith('/')) {
      return `http://localhost:5173${input}`
    }
  }

  return DEFAULT_RETURN_TO
}

async function exchangeCodeForTokens(code) {
  const config = getGoogleOAuthConfig()
  if (!config) {
    throw new Error('Google OAuth is not configured.')
  }

  const body = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Failed to exchange Google auth code')
  }

  return payload
}

async function refreshGoogleAccessToken(refreshToken) {
  const config = getGoogleOAuthConfig()
  if (!config) {
    throw new Error('Google OAuth is not configured.')
  }

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  })

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || 'Failed to refresh Google access token')
  }

  return payload
}

async function getValidGoogleAccessToken() {
  const state = await readGoogleCalendarState()
  const tokens = state.tokens

  if (!tokens) {
    return null
  }

  const expiryDate = tokens.expiryDate ? new Date(tokens.expiryDate).getTime() : 0
  if (tokens.access_token && expiryDate && expiryDate > Date.now() + 60 * 1000) {
    return tokens.access_token
  }

  if (!tokens.refresh_token) {
    await writeGoogleCalendarState({
      connected: false,
      calendarId: state.calendarId || DEFAULT_CALENDAR_ID,
      tokens: null,
      updatedAt: new Date().toISOString(),
      error: 'expired_token_no_refresh_token',
    })
    return null
  }

  try {
    const refreshed = await refreshGoogleAccessToken(tokens.refresh_token)
    const nextTokens = {
      ...tokens,
      ...refreshed,
      refresh_token: refreshed.refresh_token || tokens.refresh_token,
      expiryDate: refreshed.expires_in ? Date.now() + refreshed.expires_in * 1000 : Date.now() + 55 * 60 * 1000,
    }

    await writeGoogleCalendarState({
      ...state,
      connected: true,
      tokens: nextTokens,
      updatedAt: new Date().toISOString(),
    })

    return nextTokens.access_token
  } catch (err) {
    await writeGoogleCalendarState({
      connected: false,
      calendarId: state.calendarId || DEFAULT_CALENDAR_ID,
      tokens: null,
      updatedAt: new Date().toISOString(),
      error: 'refresh_failed',
    })
    return null
  }
}

app.get('/google-calendar/status', async (req, res) => {
  try {
    const state = await readGoogleCalendarState()
    return res.json({
      oauthConfigured: isGoogleOAuthConfigured(),
      connected: !!state.tokens?.access_token || !!state.tokens?.refresh_token,
      calendarId: state.calendarId || DEFAULT_CALENDAR_ID,
      connectedAt: state.connectedAt || null,
      updatedAt: state.updatedAt || null,
      error: state.error || null,
    })
  } catch (err) {
    console.error('/google-calendar/status error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

app.delete('/google-calendar/disconnect', async (req, res) => {
  try {
    await writeGoogleCalendarState({ connected: false, calendarId: DEFAULT_CALENDAR_ID, tokens: null, updatedAt: new Date().toISOString() })
    return res.json({ success: true })
  } catch (err) {
    console.error('/google-calendar/disconnect error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

app.get('/google-calendar/events', async (req, res) => {
  try {
    const accessToken = await getValidGoogleAccessToken()
    if (!accessToken) {
      return res.status(401).json({ success: false, error: 'google_calendar_not_connected' })
    }

    const state = await readGoogleCalendarState()
    const calendarId = req.query.calendarId ? String(req.query.calendarId) : state.calendarId || DEFAULT_CALENDAR_ID
    const limit = parseInt(req.query.maxResults, 10)
    const maxResults = !isNaN(limit) && limit > 0 ? limit : 10

    const params = new URLSearchParams({
      maxResults: String(maxResults),
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: new Date().toISOString(),
    })

    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const payload = await response.json()
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: payload.error?.message || payload.error || 'google_calendar_fetch_failed',
      })
    }

    await writeGoogleCalendarState({
      ...state,
      connected: true,
      calendarId,
      updatedAt: new Date().toISOString(),
    })

    return res.json(payload)
  } catch (err) {
    console.error('/google-calendar/events error:', err)
    return res.status(500).json({ success: false, error: 'internal_server_error' })
  }
})

app.get('/auth/google/start', (req, res) => {
  try {
    const returnTo = safeReturnTo(req.query.returnTo)
    const state = Buffer.from(JSON.stringify({ returnTo, nonce: makeId() }), 'utf8').toString('base64url')
    return res.redirect(buildGoogleAuthUrl({ state }))
  } catch (err) {
    console.error('/auth/google/start error:', err)
    return res.status(503).send('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.')
  }
})

app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query
    if (error) return res.status(400).send(`Google auth failed: ${error}`)
    if (!code || !state) return res.status(400).send('Missing Google auth code or state.')

    let parsedState = {}
    try {
      parsedState = JSON.parse(Buffer.from(String(state), 'base64url').toString('utf8'))
    } catch (err) {
      parsedState = {}
    }

    const tokenResponse = await exchangeCodeForTokens(String(code))
    const existingState = await readGoogleCalendarState()
    const storedTokens = {
      ...existingState.tokens,
      ...tokenResponse,
      refresh_token: tokenResponse.refresh_token || existingState.tokens?.refresh_token || null,
      expiryDate: tokenResponse.expires_in ? Date.now() + tokenResponse.expires_in * 1000 : Date.now() + 55 * 60 * 1000,
    }

    await writeGoogleCalendarState({
      connected: true,
      calendarId: existingState.calendarId || DEFAULT_CALENDAR_ID,
      tokens: storedTokens,
      connectedAt: existingState.connectedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    const returnTo = safeReturnTo(parsedState.returnTo)
    const redirectUrl = new URL(returnTo)
    redirectUrl.searchParams.set('googleConnected', '1')
    return res.redirect(redirectUrl.toString())
  } catch (err) {
    console.error('/auth/google/callback error:', err)
    return res.status(500).send('Failed to connect Google Calendar.')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})