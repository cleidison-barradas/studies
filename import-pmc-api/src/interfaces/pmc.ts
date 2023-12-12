
export interface XLSPMCData {
  'EAN 1': string
  'PMC 12%': number,
  'PMC 17%': number,
  'PMC 17,5%': number,
  'PMC 18%': number,
  'PMC 20%': number
}

export interface PMCData {
  ean: string
  region_1: number,
  region_2: number,
  region_3: number,
  region_4: number,
  region_5: number
}