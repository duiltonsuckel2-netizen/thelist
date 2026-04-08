interface Props {
  onClick: () => void
}

export function FAB({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Adicionar novo lugar"
      className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-40 h-14 w-14 rounded-full bg-gradient-to-b from-gold-400 to-gold-700 text-ink-950 shadow-[0_18px_40px_-10px_rgba(196,163,90,0.55),0_0_0_1px_rgba(196,163,90,0.4)] flex items-center justify-center text-2xl font-light hover:from-gold-300 hover:to-gold-600 active:scale-95 transition-all"
    >
      +
    </button>
  )
}
