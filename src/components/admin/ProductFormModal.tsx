import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { FormField, SelectField } from '@/components/ui/FormField'
import { productFormSchema, type ProductFormValues } from '@/lib/schemas'
import {
  defaultFormValues,
  fileToDataUrl,
  productToForm,
  stockToList,
} from '@/lib/adminProduct'
import { productImage } from '@/lib/assets'
import { CATEGORY_LABEL, type Category, type Product } from '@/types'

const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[]

const COLLECTIONS = [
  'Coleção 01 — Partitura',
  'Coleção 02 — Maré',
  'Coleção 03 — Jardim de Inverno',
]

function ImageInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value?: string
  onChange: (v: string) => void
  error?: string
}) {
  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  return (
    <div>
      <p className="field-label">{label}</p>
      <div className="flex items-center gap-4">
        <div className="h-28 w-24 shrink-0 bg-paper-deep/70">
          {value ? (
            <img src={productImage(value)} alt="" className="product-img h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-wide2 text-ink/40">
              sem foto
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="btn-outline cursor-pointer px-4 py-3">
            {loading ? 'Processando…' : 'Enviar imagem'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setLoading(true)
                setFileError(null)
                try {
                  onChange(await fileToDataUrl(file))
                } catch (err) {
                  setFileError(err instanceof Error ? err.message : 'Erro ao processar a imagem')
                } finally {
                  setLoading(false)
                }
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="link-underline block text-[11px] uppercase tracking-wide2 text-ink/60"
            >
              Remover
            </button>
          )}
        </div>
      </div>
      {(error || fileError) && (
        <p role="alert" className="mt-1.5 text-[12px] text-red-700">
          {error ?? fileError}
        </p>
      )}
    </div>
  )
}

export function ProductFormModal({
  open,
  product,
  onClose,
  onSubmit,
}: {
  open: boolean
  product: Product | null
  onClose: () => void
  onSubmit: (values: ProductFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultFormValues(),
  })

  const { fields, replace } = useFieldArray({ control, name: 'stock' })
  const category = watch('category')
  const imageFront = watch('imageFront')
  const imageBack = watch('imageBack')

  // carrega os dados ao abrir (novo produto ou edição)
  useEffect(() => {
    if (open) reset(product ? productToForm(product) : defaultFormValues())
  }, [open, product, reset])

  // ao trocar a categoria, os tamanhos mudam
  useEffect(() => {
    if (!open) return
    const current = Object.fromEntries(fields.map((f) => [f.size, f.qty]))
    const next = stockToList(category, current)
    if (next.map((n) => n.size).join() !== fields.map((f) => f.size).join()) replace(next)
  }, [category]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Editar produto' : 'Novo produto'} wide>
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values)
        })}
        noValidate
        className="grid gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <FormField label="Nome" error={errors.name?.message} className="md:col-span-2" {...register('name')} />

        <SelectField label="Categoria" error={errors.category?.message} {...register('category')}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </SelectField>
        <SelectField label="Coleção" error={errors.collection?.message} {...register('collection')}>
          {COLLECTIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </SelectField>

        <FormField
          label="Preço (R$)"
          type="number"
          step="0.01"
          inputMode="decimal"
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
        <FormField
          label="Preço antigo (opcional)"
          type="number"
          step="0.01"
          inputMode="decimal"
          error={errors.compareAtPrice?.message}
          {...register('compareAtPrice', {
            setValueAs: (v) => (v === '' || v === null || Number.isNaN(Number(v)) ? undefined : Number(v)),
          })}
        />

        <FormField label="Nome da cor" error={errors.colorName?.message} {...register('colorName')} />
        <div>
          <label htmlFor="colorHex" className="field-label">
            Cor (hex)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              aria-label="Selecionar cor"
              value={/^#[0-9a-fA-F]{6}$/.test(watch('colorHex')) ? watch('colorHex') : '#000000'}
              onChange={(e) => setValue('colorHex', e.target.value, { shouldValidate: true })}
              className="h-10 w-12 cursor-pointer border-0 bg-transparent p-0"
            />
            <input id="colorHex" className="field" {...register('colorHex')} />
          </div>
          {errors.colorHex && (
            <p role="alert" className="mt-1.5 text-[12px] text-red-700">
              {errors.colorHex.message}
            </p>
          )}
        </div>

        <FormField
          label="Descrição curta"
          error={errors.shortDescription?.message}
          className="md:col-span-2"
          {...register('shortDescription')}
        />
        <div className="md:col-span-2">
          <label htmlFor="description" className="field-label">
            Descrição completa
          </label>
          <textarea
            id="description"
            rows={4}
            className="field resize-y border border-ink/30 p-3"
            aria-invalid={Boolean(errors.description)}
            {...register('description')}
          />
          {errors.description && (
            <p role="alert" className="mt-1.5 text-[12px] text-red-700">
              {errors.description.message}
            </p>
          )}
        </div>

        <FormField
          label="Composição"
          error={errors.composition?.message}
          className="md:col-span-2"
          {...register('composition')}
        />
        <FormField label="Modelagem" error={errors.fit?.message} {...register('fit')} />
        <FormField label="Comprimento" error={errors.length?.message} {...register('length')} />

        <fieldset className="md:col-span-2">
          <legend className="field-label">Estoque por tamanho</legend>
          <div className="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-5">
            {fields.map((f, i) => (
              <div key={f.id}>
                <label htmlFor={`stock-${i}`} className="text-[11px] uppercase tracking-wide2 text-ink/60">
                  {f.size}
                </label>
                <input
                  id={`stock-${i}`}
                  type="number"
                  min={0}
                  className="field"
                  aria-invalid={Boolean(errors.stock?.[i]?.qty)}
                  {...register(`stock.${i}.qty` as const, { valueAsNumber: true })}
                />
                {errors.stock?.[i]?.qty && (
                  <p role="alert" className="mt-1 text-[11px] text-red-700">
                    {errors.stock[i]?.qty?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        <ImageInput
          label="Foto principal (frente)"
          value={imageFront}
          onChange={(v) => setValue('imageFront', v, { shouldValidate: true })}
          error={errors.imageFront?.message}
        />
        <ImageInput
          label="Foto secundária (costas, opcional)"
          value={imageBack}
          onChange={(v) => setValue('imageBack', v)}
        />

        <div className="flex flex-wrap gap-8 md:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 text-[14px]">
            <input type="checkbox" className="h-4 w-4 accent-navy" {...register('isNew')} /> Marcar como novo
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-[14px]">
            <input type="checkbox" className="h-4 w-4 accent-navy" {...register('featured')} /> Destaque na home
          </label>
        </div>

        <div className="mt-2 flex justify-end gap-3 border-t border-ink/15 pt-6 md:col-span-2">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {product ? 'Salvar alterações' : 'Criar produto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
