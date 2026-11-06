import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDownIcon } from './Icons'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

export function Accordion({
  items,
  defaultOpen,
}: {
  items: AccordionItem[]
  defaultOpen?: string
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null)

  return (
    <div className="divide-y divide-ink/15 border-y border-ink/15">
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div key={item.id}>
            <h3 className="font-sans">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-${item.id}`}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between py-5 text-left text-[11px] font-medium uppercase tracking-wide2"
              >
                {item.title}
                <ChevronDownIcon
                  className={`transition-transform duration-500 ease-silk ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 text-[14px] leading-relaxed text-ink/75">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
