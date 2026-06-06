import { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

<<<<<<< HEAD
=======
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
const APP_PROVIDERS = [
  { id: 'google', label: 'Google' },
  { id: 'github', label: 'GitHub' },
]

export default function Profile() {
<<<<<<< HEAD
  const [user, setUser] = useState(null)
  const [personalityText, setPersonalityText] = useState('Neutral')

  useEffect(() => {
    const savedUser = localStorage.getItem('authUser')
    const savedPersona = localStorage.getItem('personaText')
    if (savedUser) setUser(JSON.parse(savedUser))
    if (savedPersona) setPersonalityText(savedPersona)
  }, [])

  function loginWithApp(provider) {
    // Simulated login flow — replace with real OAuth in production
    const demoUser = { name: provider.label + ' User', provider: provider.id }
    setUser(demoUser)
    localStorage.setItem('authUser', JSON.stringify(demoUser))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('authUser')
  }

  function generatePersonality() {
    // Simulated AI generation — replace with real AI call if available
=======
  const [user, setUser]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [personalityText, setPersonalityText] = useState('Neutral')

  // On mount: check if we already have a session
  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUser(data) })
      .finally(() => setLoading(false))

    const savedPersona = localStorage.getItem('personaText')
    if (savedPersona) setPersonalityText(savedPersona)
  }, [])

function loginWithApp(provider) {
  const returnTo = encodeURIComponent(`${window.location.origin}/profile`)
  if (provider.id === 'google') {
    window.location.href = `${API}/auth/google/start?mode=login&returnTo=${returnTo}`
  } else {
    window.location.href = `${API}/auth/github/start?returnTo=${returnTo}`
  }
}

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  function generatePersonality() {
>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
    const options = [
      'Analytical — Clear, data-driven guidance.',
      'Friendly — Warm, conversational, and encouraging.',
      'Direct — Short, to-the-point, and action-focused.',
      'Encouraging — Motivational and optimistic in tone.',
<<<<<<< HEAD
      'Neutral — Balanced and pragmatic.'
=======
      'Neutral — Balanced and pragmatic.',
>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
    ]
    const pick = options[Math.floor(Math.random() * options.length)]
    setPersonalityText(pick)
    localStorage.setItem('personaText', pick)
  }

<<<<<<< HEAD
=======
  if (loading) return <MainLayout title="Profile"><p className="text-slate-400">Loading…</p></MainLayout>

>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
  return (
    <MainLayout title="Profile" subtitle="Your account, streak, and preferences">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassCard title="User" subtitle="Identity">
          {user ? (
            <>
<<<<<<< HEAD
              <div className="text-4xl font-black text-white">{user.name}</div>
              <p className="mt-2 text-sm text-slate-400">Signed in with {user.provider}</p>
=======
              {user.avatar && (
                <img src={user.avatar} className="mb-3 h-12 w-12 rounded-full" alt="" />
              )}
              <div className="text-4xl font-black text-white">{user.name}</div>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <p className="mt-1 text-sm text-slate-500">via {user.provider}</p>
>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
              <div className="mt-4 flex gap-2">
                <button
                  onClick={logout}
                  className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl font-black text-white">Guest</div>
              <p className="mt-2 text-sm text-slate-400">Not signed in</p>
              <div className="mt-4 flex gap-2">
                {APP_PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loginWithApp(p)}
                    className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                  >
                    Sign in with {p.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </GlassCard>

<<<<<<< HEAD
        <GlassCard title="Preferences" subtitle="Personality & streak">
          <div>
            <label className="block text-sm text-slate-300">Personality (AI-generated)</label>
            <div className="mt-2 rounded-lg bg-slate-900/80 px-3 py-3 text-sm text-white">{personalityText}</div>
=======
        {/* Preferences card unchanged */}
        <GlassCard title="Preferences" subtitle="Personality & streak">
          <div>
            <label className="block text-sm text-slate-300">Personality (AI-generated)</label>
            <div className="mt-2 rounded-lg bg-slate-900/80 px-3 py-3 text-sm text-white">
              {personalityText}
            </div>
>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
            <div className="mt-3 flex gap-2">
              <button
                onClick={generatePersonality}
                className="rounded-2xl bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                Generate with AI
              </button>
            </div>
<<<<<<< HEAD

=======
>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
            <div className="mt-6">
              <div className="text-4xl font-black text-amber-300">14 days</div>
              <p className="mt-2 text-sm text-slate-400">Keep it going with one daily focus session.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> dc23d5bc8fc7d3b5464c749ebe9b020f5d82f373
