import { ProductData } from './ProductData'

export interface SearchResult {
  term: string,
  origin: string,
  topScorer: ProductData,
  attractions: ProductData[],
  stars: ProductData[],
  superstars: ProductData[],
}
