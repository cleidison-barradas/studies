import React, { createContext, useEffect, useState } from 'react'
import {
  ISuggestion,
  SearchProduct,
  PostSearchResponse,
} from '../services/search/response.interface'

interface SearchContextData {
  query: string
  isValidating: boolean
  products: SearchProduct[]
  fingerprint: string | null
  suggestion: ISuggestion[]
  setQuery: React.Dispatch<React.SetStateAction<string>>
  setFingerprint: React.Dispatch<React.SetStateAction<string | null>>
  setIsValidating: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<PostSearchResponse | undefined>>
  setSuggestion: React.Dispatch<React.SetStateAction<ISuggestion[] | []>>
}

const searchContext = createContext({} as SearchContextData)
export default searchContext

const { Provider } = searchContext

export const SearchProvider: React.FC = ({ children }) => {
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<ISuggestion[] | []>([])
  const [data, setData] = useState<PostSearchResponse | undefined>()
  const [isValidating, setIsValidating] = useState(false)
  const [query, setQuery] = useState('')

  const products = data ? data.products : []

  useEffect(() => {
    if (data) {
      if (data.fingerprint) {
        setFingerprint(data.fingerprint)
      }
    }
  }, [data])

  return (
    <Provider
      value={{
        query,
        products,
        suggestion,
        fingerprint,
        isValidating,
        setSuggestion,
        setData,
        setQuery,
        setFingerprint,
        setIsValidating,
      }}
    >
      {children}
    </Provider>
  )
}
