import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Bot, LoaderCircle, Mic, Paperclip, Sparkles, Send, Wand2, Zap } from 'lucide-react'
import MainLayout from '../layouts/MainLayout'
import GlassCard from '../components/GlassCard'

const starterMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "I'm ready to help you plan your day, turn notes into tasks, and keep the conversation focused.",
    hint: 'Try asking for a schedule, summary, or reminder plan.',
  },
]

const quickPrompts = [
  'Plan my day around 9 AM deep work',
  'Turn my notes into a task list',
  'Give me a short summary of today',
  'Set a reminder for my next break',
]

const memoryItems = [
  'Prefers deep work in the morning',
  'Likes concise next steps and reminders',
  'Keeps a running list of follow-up tasks',
]

const contextCards = [
  {
    label: 'Connected modules',
    value: 'Tasks, Calendar, Focus',
  },
  {
    label: 'Response style',
    value: 'Short, actionable, calm',
  },
  {
    label: 'Best for',
    value: 'Planning, summarizing, reminders',
  },
]

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function buildAssistantReply(input) {
  const normalized = input.toLowerCase()

  if (normalized.includes('plan') || normalized.includes('schedule') || normalized.includes('day')) {
    return {
      content: 'Here is a simple day plan: 1) Deep work block first, 2) short break at the halfway point, 3) admin tasks after lunch, 4) review before you stop.',
      hint: 'If you want, I can turn that into calendar blocks or a checklist.',
    }
  }

  if (normalized.includes('remind') || normalized.includes('break')) {
    return {
      content: 'I can help set a reminder. Tell me the time and what you want to be reminded about, and I will format it clearly for your schedule.',
      hint: 'Example: remind me at 2 PM to stretch.',
    }
  }

  if (normalized.includes('task') || normalized.includes('todo') || normalized.includes('list')) {
    return {
      content: 'I turned that into a task-ready flow: capture the idea, split it into the next action, and queue the rest as follow-up items.',
      hint: 'Send me a messy note and I will clean it up for you.',
    }
  }

  if (normalized.includes('summary') || normalized.includes('recap') || normalized.includes('today')) {
    return {
      content: 'Today looks focused: you are making progress, and the next useful move is to protect one more deep work block before checking messages.',
      hint: 'I can also turn this into a 3-bullet daily recap.',
    }
  }

  return {
    content: 'I can help with planning, reminders, task cleanup, and daily summaries. Give me one goal and I will turn it into a clear next step.',
    hint: 'Try asking for a schedule, recap, or task breakdown.',
  }
}

function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={[
          'max-w-[88%] rounded-[24px] border px-4 py-3 text-sm leading-6 shadow-lg',
          isAssistant
            ? 'border-violet-400/20 bg-violet-500/10 text-violet-50'
            : 'border-white/10 bg-white/10 text-slate-100',
        ].join(' ')}
      >
        {message.role === 'assistant' ? (
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-violet-200/80">
            <Bot size={12} />
            AI assistant
          </div>
        ) : (
          <div className="mb-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">You</div>
        )}
        <p>{message.content}</p>
        {message.hint ? <p className="mt-3 text-xs text-slate-300/80">{message.hint}</p> : null}
      </div>
    </motion.div>
  )
}

export default function Chatbot() {
  const [messages, setMessages] = useState(starterMessages)
  const [draft, setDraft] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef(null)

  const conversationCount = useMemo(() => messages.length, [messages.length])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  function pushAssistantReply(userText) {
    setIsThinking(true)

    window.setTimeout(() => {
      const reply = buildAssistantReply(userText)

      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: 'assistant',
          content: reply.content,
          hint: reply.hint,
        },
      ])
      setIsThinking(false)
    }, 650)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const text = draft.trim()
    if (!text || isThinking) return

    setMessages((current) => [
      ...current,
      {
        id: makeId(),
        role: 'user',
        content: text,
      },
    ])
    setDraft('')
    pushAssistantReply(text)
  }

  function handlePrompt(prompt) {
    if (isThinking) return
    setDraft(prompt)
  }

  return (
    <MainLayout title="Chat AI" subtitle="A focused conversation surface for planning, reminders, and summaries">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <GlassCard title="Conversation" subtitle="Speak naturally, get structured next steps" className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-violet-200">
              <Sparkles size={12} />
              Smart chat
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {conversationCount} messages
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Memory enabled
            </span>
          </div>

          <div
            ref={scrollRef}
            className="mt-5 max-h-[560px] space-y-4 overflow-y-auto pr-1"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isThinking ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-3 rounded-[24px] border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100">
                  <LoaderCircle className="animate-spin" size={16} />
                  Thinking about the best next step...
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3 border-t border-white/10 pt-5">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePrompt(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-4 shadow-inner shadow-black/20">
              <textarea
                rows={4}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSubmit(event)
                  }
                }}
                placeholder="Ask the assistant to plan your day, summarize a conversation, or draft a reminder..."
                className="w-full resize-none border-0 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <Paperclip size={12} />
                    Attach context
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <Mic size={12} />
                    Voice ready
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isThinking || !draft.trim()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-violet-500/50"
                >
                  <Send size={16} />
                  Send message
                </button>
              </div>
            </div>
          </form>
        </GlassCard>

        <div className="space-y-6">

          <GlassCard title="AI shortcuts" subtitle="Try one of these actions">
            <div className="space-y-3">
              <button type="button" className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10">
                <span className="inline-flex items-center gap-2">
                  <Wand2 size={16} className="text-violet-300" />
                  Turn notes into tasks
                </span>
                <ArrowUpRight size={16} className="text-slate-400" />
              </button>

              <button type="button" className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/10">
                <span className="inline-flex items-center gap-2">
                  <Zap size={16} className="text-amber-300" />
                  Build a focus session
                </span>
                <ArrowUpRight size={16} className="text-slate-400" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  )
}
