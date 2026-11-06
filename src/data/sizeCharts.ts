import type { SizeChart } from '@/types'

export const TOP_SIZES = ['P', 'M', 'G', 'GG']
export const PANTS_SIZES = ['38', '40', '42', '44', '46']
export const CAP_SIZES = ['Único']

const toleranceNote =
  'Medidas da peça sobre superfície plana, com tolerância de ±1,5 cm. Em caso de dúvida entre dois tamanhos, consulte a modelagem na aba ao lado.'

export const teeChart: SizeChart = {
  columns: ['Largura (cm)', 'Comprimento (cm)', 'Manga (cm)'],
  rows: [
    { size: 'P', values: [58, 68, 24] },
    { size: 'M', values: [60, 70, 25] },
    { size: 'G', values: [62, 72, 26] },
    { size: 'GG', values: [64, 74, 27] },
  ],
  note: `Modelagem oversized boxy. ${toleranceNote}`,
}

export const tankChart: SizeChart = {
  columns: ['Largura (cm)', 'Comprimento (cm)', 'Cava (cm)'],
  rows: [
    { size: 'P', values: [52, 66, 25] },
    { size: 'M', values: [54, 68, 26] },
    { size: 'G', values: [56, 70, 27] },
    { size: 'GG', values: [58, 72, 28] },
  ],
  note: `Modelagem regular com cava ampla. ${toleranceNote}`,
}

export const wideLegChart: SizeChart = {
  columns: ['Cintura (cm)', 'Quadril (cm)', 'Gancho (cm)', 'Entrepernas (cm)', 'Barra (cm)'],
  rows: [
    { size: '38', values: [74, 102, 31, 80, 27] },
    { size: '40', values: [78, 106, 32, 81, 28] },
    { size: '42', values: [82, 110, 33, 82, 29] },
    { size: '44', values: [86, 114, 34, 83, 30] },
    { size: '46', values: [90, 118, 35, 84, 31] },
  ],
  note: `Cintura medida em peça plana (multiplique por 2 para o perímetro). ${toleranceNote}`,
}

export const flareChart: SizeChart = {
  columns: ['Cintura (cm)', 'Quadril (cm)', 'Gancho (cm)', 'Entrepernas (cm)', 'Barra (cm)'],
  rows: [
    { size: '38', values: [72, 96, 29, 80, 25] },
    { size: '40', values: [76, 100, 30, 81, 26] },
    { size: '42', values: [80, 104, 31, 82, 27] },
    { size: '44', values: [84, 108, 32, 83, 28] },
    { size: '46', values: [88, 112, 33, 84, 29] },
  ],
  note: `Modelagem mais ajustada no quadril e coxa, com abertura progressiva a partir do joelho. ${toleranceNote}`,
}

export const jacketChart: SizeChart = {
  columns: ['Peito (cm)', 'Comprimento (cm)', 'Manga (cm)', 'Ombro (cm)'],
  rows: [
    { size: 'P', values: [62, 66, 62, 54] },
    { size: 'M', values: [64, 68, 63, 56] },
    { size: 'G', values: [66, 70, 64, 58] },
    { size: 'GG', values: [68, 72, 65, 60] },
  ],
  note: `Caimento oversized com ombro caído. ${toleranceNote}`,
}

export const sweaterChart: SizeChart = {
  columns: ['Peito (cm)', 'Comprimento (cm)', 'Manga (cm)', 'Ombro (cm)'],
  rows: [
    { size: 'P', values: [60, 64, 60, 52] },
    { size: 'M', values: [62, 66, 61, 54] },
    { size: 'G', values: [64, 68, 62, 56] },
    { size: 'GG', values: [66, 70, 63, 58] },
  ],
  note: `Tricô com elasticidade leve; a peça relaxa levemente após as primeiras horas de uso. ${toleranceNote}`,
}

export const hoodieChart: SizeChart = {
  columns: ['Peito (cm)', 'Comprimento (cm)', 'Manga (cm)', 'Ombro (cm)'],
  rows: [
    { size: 'P', values: [64, 68, 62, 56] },
    { size: 'M', values: [66, 70, 63, 58] },
    { size: 'G', values: [68, 72, 64, 60] },
    { size: 'GG', values: [70, 74, 65, 62] },
  ],
  note: `Modelagem oversized em moletom pesado. ${toleranceNote}`,
}

export const capChart: SizeChart = {
  columns: ['Circunferência (cm)', 'Aba (cm)', 'Altura da copa (cm)'],
  rows: [{ size: 'Único', values: [62, 7, 10] }],
  note: 'Tamanho único com fecho metálico regulável na parte de trás, de 54 a 62 cm de circunferência. Copa estruturada de 6 painéis, aba levemente curva.',
}
