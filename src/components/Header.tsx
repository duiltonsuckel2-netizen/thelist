interface Props {
  total: number
  visited: number
}

export function Header({ total, visited }: Props) {
  const pending = total - visited
  const progress = total === 0 ? 0 : Math.round((visited / total) * 100)

  return (
    <header className="relative pt-16 pb-12 px-6 sm:px-10 max-w-3xl mx-auto">
      <p className="text-[10px] tracking-widest2 uppercase text-gold-500/80 mb-4">
        Guia Pessoal · Florianópolis
      </p>
      <h1 className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl text-sand-50 font-medium">
        Meus <span className="italic gold-text">Lugares</span>
      </h1>

      <div className="mt-8 flex items-end gap-8 text-sand-300">
        <Counter label="Total" value={total} />
        <Divider />
        <Counter label="Visitados" value={visited} accent />
        <Divider />
        <Counter label="Pendentes" value={pending} />
      </div>

      <div className="mt-6">
        <div className="h-[3px] w-full bg-ink-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background:
                'linear-gradient(90deg, #8b6914 0%, #c4a35a 50%, #e1c789 100%)',
              boxShadow: '0 0 14px rgba(196,163,90,0.45)',
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] tracking-widest2 uppercase text-sand-400">
          <span>Progresso</span>
          <span className="text-gold-400">{progress}%</span>
        </div>
      </div>

      <div className="hairline mt-10" />
    </header>
  )
}

function Counter({
  label,
  value,
  accent = false,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div>
      <div
        className={`font-display text-3xl sm:text-4xl leading-none ${
          accent ? 'gold-text' : 'text-sand-100'
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] tracking-widest2 uppercase text-sand-400">
        {label}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="self-stretch w-px bg-ink-700" />
}
