import type { SizeChart } from '@/types'

export function SizeChartTable({ chart, highlight }: { chart: SizeChart; highlight?: string | null }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
          <caption className="sr-only">Tabela de medidas em centímetros</caption>
          <thead>
            <tr className="border-b border-ink/30 text-[10px] uppercase tracking-wide2 text-ink/60">
              <th scope="col" className="py-3 pr-4 font-medium">
                Tamanho
              </th>
              {chart.columns.map((c) => (
                <th key={c} scope="col" className="px-2 py-3 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr
                key={row.size}
                className={`border-b border-ink/10 ${highlight === row.size ? 'bg-royal/10' : ''}`}
              >
                <th scope="row" className="py-3 pr-4 font-display text-xl font-medium">
                  {row.size}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className="px-2 py-3 tabular-nums">
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-ink/55">{chart.note}</p>
    </div>
  )
}
