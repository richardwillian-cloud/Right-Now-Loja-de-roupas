import { PageHeader } from '@/components/ui/PageHeader'
import { Accordion } from '@/components/ui/Accordion'
import { formatBRL } from '@/lib/format'
import { FREE_SHIPPING_FROM } from '@/lib/shipping'

export default function HelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Atendimento"
        title="Ajuda"
        description="Tudo o que você precisa saber sobre entrega, trocas, medidas e cuidados. Loja fictícia: as políticas abaixo são demonstrativas."
      />
      <div className="container-rn max-w-3xl pb-10">
        <div id="entrega" className="scroll-mt-40">
          <Accordion
            defaultOpen="entrega"
            items={[
              {
                id: 'entrega',
                title: 'Prazos de entrega',
                content: (
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Entrega padrão: 4 a 10 dias úteis, conforme a região.</li>
                    <li>Entrega expressa: 1 a 5 dias úteis.</li>
                    <li>Frete grátis (padrão) para pedidos a partir de {formatBRL(FREE_SHIPPING_FROM)}.</li>
                    <li>Envio em até 2 dias úteis após a confirmação do pagamento.</li>
                  </ul>
                ),
              },
              {
                id: 'trocas',
                title: 'Trocas e devoluções',
                content: (
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Primeira troca gratuita em até 30 dias, com a peça sem uso e com etiquetas.</li>
                    <li>Direito de arrependimento: 7 dias corridos após o recebimento.</li>
                    <li>Peças com defeito de fabricação são trocadas sem custo.</li>
                  </ul>
                ),
              },
              {
                id: 'medidas',
                title: 'Guia de medidas',
                content: (
                  <p>
                    Cada produto traz a própria tabela de medidas, com largura, comprimento, cintura, quadril e
                    entrepernas em centímetros. Meça uma peça sua que tenha o caimento que você gosta,
                    deitada sobre uma superfície plana, e compare.
                  </p>
                ),
              },
              {
                id: 'cuidados',
                title: 'Cuidados com as peças bordadas',
                content: (
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Lave do avesso, em água fria, sem alvejante.</li>
                    <li>Seque à sombra; evite a secadora.</li>
                    <li>Passe sempre do avesso e nunca diretamente sobre o bordado.</li>
                    <li>Tricôs devem ser secos na horizontal e guardados dobrados.</li>
                  </ul>
                ),
              },
              {
                id: 'pagamento',
                title: 'Formas de pagamento',
                content: (
                  <p>
                    Pix com 5% de desconto, cartão de crédito em até 6x sem juros (parcela mínima de R$ 60) e
                    boleto. Nenhum pagamento é realmente processado neste site.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}
