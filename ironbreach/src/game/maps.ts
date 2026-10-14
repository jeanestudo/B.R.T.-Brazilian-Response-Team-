export type BrtMap = {
  id: string
  name: string
  subtitle: string
  style: string
  size: string
  routes: readonly string[]
}

/** Map rotation for B.R.T.; geometry starts with Morro da Rocinha and stays deterministic. */
export const BRT_MAPS: readonly BrtMap[] = [
  {
    id: 'rocinha',
    name: 'MORRO DA ROCINHA',
    subtitle: 'VIELAS DO ALTO',
    style: 'Favela verticalizada · três rotas · pátio central',
    size: '112 × 112 m',
    routes: ['Viela Norte', 'Escadão Central', 'Laje Sul'],
  },
  {
    id: 'santos',
    name: 'PORTO DE SANTOS',
    subtitle: 'PÁTIO DOS CONTÊINERES',
    style: 'Docas abertas · longas linhas · cobertura modular',
    size: '112 × 112 m',
    routes: ['Armazéns', 'Linha dos Guindastes', 'Cais Leste'],
  },
]

export const ACTIVE_BRT_MAP = BRT_MAPS[0]
export const BRT_BRAND = 'B.R.T.'
export const BRT_FULL_NAME = 'Brazilian Response Team'
