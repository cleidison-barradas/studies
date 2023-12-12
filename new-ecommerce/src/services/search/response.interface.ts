import Product from "../../interfaces/product"

export interface ISuggestion {
  text: string
  score: number
  freq: number
}

export interface PostSearchResponse {
  products: SearchProduct[]
  fingerprint?: string
}

export interface SearchProduct extends Product {
  _score: number
}

export interface SuggestionTermResponse {
  suggestions: ISuggestion[]
}
