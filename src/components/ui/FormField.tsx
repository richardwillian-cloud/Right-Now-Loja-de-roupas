import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import clsx from 'clsx'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  suffix?: ReactNode
}

/** Campo com rótulo flutuante simples, mensagem de erro e acessibilidade. */
export const FormField = forwardRef<HTMLInputElement, FieldProps>(function FormField(
  { label, error, hint, suffix, id, className, ...props },
  ref,
) {
  const fieldId = id ?? `f-${props.name}`
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={clsx('field', error && 'field-error')}
          {...props}
        />
        {suffix && <span className="absolute right-0 top-1/2 -translate-y-1/2">{suffix}</span>}
      </div>
      {error ? (
        <p id={`${fieldId}-error`} role="alert" className="mt-1.5 text-[12px] text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-[12px] text-ink/45">
          {hint}
        </p>
      ) : null}
    </div>
  )
})

export const SelectField = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }
>(function SelectField({ label, error, children, ...props }, ref) {
  const fieldId = props.id ?? `f-${props.name}`
  return (
    <div>
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <select
        id={fieldId}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={clsx('field appearance-none', error && 'field-error')}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p role="alert" className="mt-1.5 text-[12px] text-red-700">
          {error}
        </p>
      )}
    </div>
  )
})
