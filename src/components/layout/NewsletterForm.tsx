import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newsletterSchema, type NewsletterValues } from '@/lib/schemas'

export function NewsletterForm() {
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({ resolver: zodResolver(newsletterSchema) })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500))
    setDone(true)
    reset()
  }

  if (done) {
    return (
      <p className="font-display text-2xl text-paper">
        Pronto. Você entrou na lista (demonstrativo — nada foi enviado).
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-md">
      <label htmlFor="newsletter-email" className="sr-only">
        E-mail
      </label>
      <div className="flex items-end gap-4 border-b border-paper/40 focus-within:border-royal-light">
        <input
          id="newsletter-email"
          type="email"
          placeholder="Seu melhor e-mail"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className="w-full bg-transparent py-3 text-[15px] text-paper outline-none placeholder:text-paper/40"
          {...register('email')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="pb-3 text-[11px] font-medium uppercase tracking-wide2 text-paper transition-colors hover:text-royal-light disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando…' : 'Entrar'}
        </button>
      </div>
      {errors.email && <p className="mt-2 text-[12px] text-red-300">{errors.email.message}</p>}
    </form>
  )
}
