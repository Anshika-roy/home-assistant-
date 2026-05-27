export default function AIOrb({ children = '🤖' }) {
  return (
    <div className="grid h-24 w-24 place-items-center rounded-[30px] bg-[radial-gradient(circle_at_30%_30%,rgba(192,132,252,0.95),rgba(76,29,149,0.95)_60%,rgba(7,10,21,1))] text-4xl text-white shadow-[0_0_40px_rgba(168,85,247,0.28)]">
      {children}
    </div>
  )
}
