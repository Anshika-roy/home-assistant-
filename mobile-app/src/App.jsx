import { useState } from 'react'
import {
  BarChart3,
  Bell,
  CalendarDays,
  Bot,
  CheckCircle2,
  Circle,
  Flame,
  Home,
  ListTodo,
  Menu,
  Mic,
  Plus,
  Settings,
  Sparkles,
  TimerReset,
  User,
} from 'lucide-react'

const tasks = [
  { title: 'Morning workout', time: '07:30', xp: '+20 XP', done: true },
  { title: 'Study React', time: '10:00', xp: '+40 XP', done: false },
  { title: 'Build dashboard UI', time: '14:00', xp: '+60 XP', done: false },
]

const stats = [
  { label: 'Focus', value: '4h 20m' },
  { label: 'Streak', value: '14 days' },
  { label: 'Level', value: '09' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  const sectionTitle =
    activeTab === 'plan'
      ? 'Plan'
      : activeTab === 'stats'
        ? 'Stats'
        : activeTab === 'more'
          ? 'More'
          : 'Home'

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-btn" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="brand">
          <span className="brand-kicker">SMART PLANNER</span>
          <h1>YAPIAP</h1>
          <span className="brand-status">{sectionTitle}</span>
        </div>

        <button className="icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
      </header>

      <main className="content">
        <section className="hero-card">
          <div className="hero-copy">
            <div className="hero-badge">
              <Sparkles size={14} />
              Good morning
            </div>
            <h2>Plan your day from your phone.</h2>
            <p>
              Track tasks, keep your streak alive, and start a focus session in one tap.
            </p>

            <div className="progress-block">
              <div className="progress-row">
                <span>Daily progress</span>
                <strong>73%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" />
              </div>
            </div>
          </div>

          <div className="hero-orb" aria-hidden="true">
            {activeTab === 'stats' ? (
              <BarChart3 size={34} />
            ) : activeTab === 'more' ? (
              <User size={34} />
            ) : (
              <Flame size={34} />
            )}
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        {activeTab === 'home' ? (
          <>
            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>Focus Session</h3>
                  <p>Next: Deep work timer</p>
                </div>
                <button className="pill-btn">
                  <TimerReset size={16} />
                  Start
                </button>
              </div>

              <div className="timer-row">
                <div>
                  <div className="timer-value">25:00</div>
                  <span className="timer-label">Ready to begin</span>
                </div>
                <div className="mini-ring">
                  <Mic size={18} />
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>Today&apos;s Tasks</h3>
                  <p>3 items on your list</p>
                </div>
                <button className="pill-btn ghost">
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="task-list">
                {tasks.map((task) => (
                  <article key={task.title} className="task-item">
                    <div className="task-check">
                      {task.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <div className="task-body">
                      <strong>{task.title}</strong>
                      <span>{task.time}</span>
                    </div>
                    <div className="task-xp">{task.xp}</div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {activeTab === 'plan' ? (
          <>
            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>Quest Board</h3>
                  <p>Productivity missions</p>
                </div>
                <ListTodo size={18} />
              </div>

              <div className="task-list">
                {tasks.map((task) => (
                  <article key={task.title} className="task-item">
                    <div className="task-check">
                      {task.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </div>
                    <div className="task-body">
                      <strong>{task.title}</strong>
                      <span>{task.time}</span>
                    </div>
                    <div className="task-xp">{task.xp}</div>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>Weekly Plan</h3>
                  <p>Schedule blocks</p>
                </div>
                <CalendarDays size={18} />
              </div>

              <div className="mini-grid">
                <div className="mini-card">Mon<br />Deep work</div>
                <div className="mini-card">Tue<br />Workout</div>
                <div className="mini-card">Wed<br />Study</div>
                <div className="mini-card">Thu<br />Review</div>
              </div>
            </section>
          </>
        ) : null}

        {activeTab === 'stats' ? (
          <>
            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>Analytics</h3>
                  <p>Performance overview</p>
                </div>
                <BarChart3 size={18} />
              </div>

              <div className="analytics-grid">
                <div className="analytics-card">
                  <span>Focus time</span>
                  <strong>4h 20m</strong>
                </div>
                <div className="analytics-card">
                  <span>Completion</span>
                  <strong>73%</strong>
                </div>
                <div className="analytics-card">
                  <span>Streak</span>
                  <strong>14 days</strong>
                </div>
                <div className="analytics-card">
                  <span>XP gained</span>
                  <strong>+120</strong>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>AI Assistant</h3>
                  <p>Suggested next step</p>
                </div>
                <Bot size={18} />
              </div>

              <div className="assistant-card">
                <div className="assistant-avatar">🤖</div>
                <p>
                  You&apos;re on track. Want me to suggest a deep-work block for tonight?
                </p>
              </div>
            </section>
          </>
        ) : null}

        {activeTab === 'more' ? (
          <>
            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>Profile</h3>
                  <p>Current streak and settings</p>
                </div>
                <User size={18} />
              </div>

              <div className="profile-card">
                <div className="profile-avatar">A</div>
                <div>
                  <strong>Anshika</strong>
                  <span>Productivity builder</span>
                </div>
              </div>

              <div className="stats-grid profile-stats">
                <article className="stat-card">
                  <span>Level</span>
                  <strong>09</strong>
                </article>
                <article className="stat-card">
                  <span>Streak</span>
                  <strong>14 days</strong>
                </article>
              </div>
            </section>

            <section className="panel">
              <div className="section-head">
                <div>
                  <h3>Settings</h3>
                  <p>App preferences</p>
                </div>
                <Settings size={18} />
              </div>

              <div className="settings-list">
                <div className="settings-item">Theme: Neon glass</div>
                <div className="settings-item">Notifications: On</div>
                <div className="settings-item">Sync: Enabled</div>
              </div>
            </section>
          </>
        ) : null}
      </main>

      <nav className="bottom-nav" aria-label="Primary">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={18} />
          <span>Home</span>
        </button>
        <button className={`nav-item ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
          <CalendarDays size={18} />
          <span>Plan</span>
        </button>
        <button className="nav-fab" aria-label="Quick action" onClick={() => setActiveTab('home')}>
          <Plus size={22} />
        </button>
        <button className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <BarChart3 size={18} />
          <span>Stats</span>
        </button>
        <button className={`nav-item ${activeTab === 'more' ? 'active' : ''}`} onClick={() => setActiveTab('more')}>
          <Settings size={18} />
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
