import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { PageHeader } from '@/components/ui/PageHeader'
import { EditIcon, PlusIcon, TrashIcon } from '@/components/ui/Icons'
import { Modal } from '@/components/ui/Modal'
import { ProductFormModal } from '@/components/admin/ProductFormModal'
import { useProductStore, totalStock } from '@/store/useProductStore'
import { useOrderStore } from '@/store/useOrderStore'
import { useUiStore } from '@/store/useUiStore'
import { formToProduct } from '@/lib/adminProduct'
import { productImage } from '@/lib/assets'
import { formatBRL, formatDate } from '@/lib/format'
import { searchMatches } from '@/lib/catalog'
import type { ProductFormValues } from '@/lib/schemas'
import { CATEGORY_LABEL, ORDER_STATUSES, type Product } from '@/types'

type Tab = 'produtos' | 'pedidos'

export default function AdminPage() {
  const { products, addProduct, updateProduct, removeProduct, resetCatalog } = useProductStore()
  const orders = useOrderStore((s) => s.orders)
  const updateStatus = useOrderStore((s) => s.updateStatus)
  const pushToast = useUiStore((s) => s.pushToast)

  const [tab, setTab] = useState<Tab>('produtos')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Product | null>(null)

  const filtered = useMemo(() => products.filter((p) => searchMatches(p, query)), [products, query])

  const stats = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.total, 0)
    return [
      { label: 'Produtos', value: String(products.length) },
      { label: 'Unidades em estoque', value: String(products.reduce((a, p) => a + totalStock(p), 0)) },
      { label: 'Pedidos', value: String(orders.length) },
      { label: 'Receita demonstrativa', value: formatBRL(revenue) },
    ]
  }, [products, orders])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (p: Product) => {
    setEditing(p)
    setFormOpen(true)
  }

  const handleSubmit = (values: ProductFormValues) => {
    if (editing) {
      updateProduct(editing.id, formToProduct(values, products, editing))
      pushToast('Produto atualizado', 'success')
    } else {
      addProduct(formToProduct(values, products))
      pushToast('Produto criado', 'success')
    }
    setFormOpen(false)
  }

  return (
    <>
      <PageHeader
        eyebrow="Gerenciamento da loja"
        title="Admin"
        description="Painel demonstrativo: crie, edite e remova produtos, ajuste estoques e acompanhe pedidos. Tudo fica salvo neste navegador."
        actions={
          <button type="button" className="btn-primary self-start md:self-end" onClick={openNew}>
            <PlusIcon width={16} height={16} /> Novo produto
          </button>
        }
      />

      <div className="container-rn">
        <dl className="grid grid-cols-2 gap-px bg-ink/15 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-paper p-6">
              <dt className="eyebrow">{s.label}</dt>
              <dd className="mt-2 font-display text-4xl tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-ink/15">
          <div role="tablist" aria-label="Seções do painel" className="flex gap-8">
            {(['produtos', 'pedidos'] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={clsx(
                  '-mb-px border-b-2 pb-4 text-[11px] font-medium uppercase tracking-wide2 transition-colors',
                  tab === t ? 'border-navy text-ink' : 'border-transparent text-ink/50 hover:text-ink',
                )}
              >
                {t === 'produtos' ? `Produtos (${products.length})` : `Pedidos (${orders.length})`}
              </button>
            ))}
          </div>
          {tab === 'produtos' && (
            <div className="flex items-center gap-6 pb-3">
              <label htmlFor="admin-search" className="sr-only">
                Buscar produto
              </label>
              <input
                id="admin-search"
                type="search"
                placeholder="Buscar produto…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="field w-56 py-1.5 text-[14px]"
              />
              <button
                type="button"
                className="link-underline text-[11px] uppercase tracking-wide2 text-ink/60"
                onClick={() => {
                  resetCatalog()
                  pushToast('Catálogo restaurado')
                }}
              >
                Restaurar catálogo
              </button>
            </div>
          )}
        </div>

        {tab === 'produtos' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <caption className="sr-only">Lista de produtos</caption>
              <thead>
                <tr className="border-b border-ink/15 text-[10px] uppercase tracking-wide2 text-ink/55">
                  <th scope="col" className="py-4 font-medium">Produto</th>
                  <th scope="col" className="py-4 font-medium">Categoria</th>
                  <th scope="col" className="py-4 font-medium">Preço</th>
                  <th scope="col" className="py-4 font-medium">Estoque</th>
                  <th scope="col" className="py-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const stock = totalStock(p)
                  return (
                    <tr key={p.id} className="border-b border-ink/10">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <span className="block aspect-[4/5] w-12 shrink-0 bg-paper-deep/70">
                            <img src={productImage(p.images[0])} alt="" className="product-img h-full w-full object-contain" />
                          </span>
                          <div>
                            <p className="font-display text-xl leading-tight">{p.name}</p>
                            <p className="flex items-center gap-2 text-[12px] text-ink/55">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full border border-ink/20"
                                style={{ backgroundColor: p.colorway.hex }}
                              />
                              {p.colorway.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{CATEGORY_LABEL[p.category]}</td>
                      <td className="py-4 tabular-nums">{formatBRL(p.price)}</td>
                      <td className="py-4">
                        <span className={clsx('tabular-nums', stock === 0 && 'text-red-700', stock > 0 && stock <= 5 && 'text-ocean-dark')}>
                          {stock === 0 ? 'Esgotado' : `${stock} un.`}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-1">
                          <button type="button" aria-label={`Editar ${p.name} ${p.colorway.name}`} className="p-2 hover:text-royal" onClick={() => openEdit(p)}>
                            <EditIcon />
                          </button>
                          <button type="button" aria-label={`Excluir ${p.name} ${p.colorway.name}`} className="p-2 hover:text-red-700" onClick={() => setToDelete(p)}>
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="py-16 text-center text-[14px] text-ink/55">Nenhum produto encontrado.</p>
            )}
          </div>
        ) : orders.length === 0 ? (
          <p className="py-20 text-center text-[14px] text-ink/55">
            Nenhum pedido ainda. Faça uma compra demonstrativa na loja.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <caption className="sr-only">Lista de pedidos</caption>
              <thead>
                <tr className="border-b border-ink/15 text-[10px] uppercase tracking-wide2 text-ink/55">
                  <th scope="col" className="py-4 font-medium">Pedido</th>
                  <th scope="col" className="py-4 font-medium">Cliente</th>
                  <th scope="col" className="py-4 font-medium">Data</th>
                  <th scope="col" className="py-4 font-medium">Total</th>
                  <th scope="col" className="py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-ink/10">
                    <td className="py-4 font-display text-xl">{o.id}</td>
                    <td className="py-4">{o.customer.name}</td>
                    <td className="py-4 text-ink/60">{formatDate(o.createdAt)}</td>
                    <td className="py-4 tabular-nums">{formatBRL(o.total)}</td>
                    <td className="py-4">
                      <label className="sr-only" htmlFor={`status-${o.id}`}>
                        Status do pedido {o.id}
                      </label>
                      <select
                        id={`status-${o.id}`}
                        value={o.status}
                        onChange={(e) => {
                          updateStatus(o.id, e.target.value as typeof o.status)
                          pushToast('Status atualizado')
                        }}
                        className="cursor-pointer border border-ink/25 bg-transparent px-3 py-2 text-[13px]"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        product={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <Modal open={Boolean(toDelete)} onClose={() => setToDelete(null)} title="Excluir produto">
        <p className="text-[14px] leading-relaxed text-ink/75">
          Tem certeza que deseja excluir <strong className="font-medium text-ink">{toDelete?.name}</strong>{' '}
          ({toDelete?.colorway.name})? Ele também será removido do catálogo da loja.
        </p>
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" className="btn-outline" onClick={() => setToDelete(null)}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn bg-red-800 text-paper hover:bg-red-900"
            onClick={() => {
              if (toDelete) {
                removeProduct(toDelete.id)
                pushToast('Produto excluído')
              }
              setToDelete(null)
            }}
          >
            Excluir
          </button>
        </div>
      </Modal>
    </>
  )
}
