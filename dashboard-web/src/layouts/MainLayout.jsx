import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function MainLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 md:p-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar title={title} subtitle={subtitle} />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
