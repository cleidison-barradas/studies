import { useCallback, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthContext from '../contexts/auth.context'
import searchContext from '../contexts/search.context'
import { searchProducts, suggestionTerms } from '../services/search/search.service'
import { trackSearch } from '@elastic/behavioral-analytics-javascript-tracker'

export const useSearch = () => {
  const { store } = useContext(AuthContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    setData,
    setQuery,
    setSuggestion,
    setIsValidating,
    query,
    products,
    suggestion,
    fingerprint,
    isValidating
  } = useContext(searchContext)

  const hasQuery = searchParams.has('q')

  const search = useCallback(
    async (text: string | null) => {

      if (text && text.trim().length > 0) {
        if (hasQuery) {
          setSearchParams({ q: text })
        }
        setQuery(text)
        setIsValidating(true)
        const response = await searchProducts({
          store,
          tenant: store!.tenant,
          fingerprint,
          query: text,
        })
        setSuggestion([])
        setData(response)
        setIsValidating(false)

        const total_results = response?.products.length || 0

        const result = response?.products || []

        const items = result.map(p => {

          return {
            document: {
              id: p.EAN,
              index: p.name
            },
            page: {
              url: '/products'
            }
          }
        })

        trackSearch({
          search: {
            query: text,
            results: {
              items,
              total_results
            }
          }
        })

      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fingerprint, store, searchParams, setData]
  )

  const suggestions = useCallback(async (text: string) => {
    const response = await suggestionTerms({
      store,
      tenant: store?.tenant || '',
      fingerprint,
      query: text
    })

    const suggestionData = response.data ? response.data.suggestions : []

    setSuggestion(suggestionData)

  }, [store, fingerprint, setSuggestion])

  const clearSearch = () => {
    setQuery('')
    setData(undefined)
    setSearchParams({}, { replace: true })
  }

  const clearSuggestions = () => setSuggestion([])

  return {
    search,
    suggestions,
    clearSearch,
    clearSuggestions,
    query,
    products,
    suggestion,
    isValidating,
  }
}
