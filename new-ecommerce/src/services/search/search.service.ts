import { searchApi } from '../../config/api'
import { PostSearchRequest } from './request.interface'
import { PostSearchResponse, SuggestionTermResponse } from './response.interface'

export async function searchProducts(data: PostSearchRequest) {
  return searchApi
    .post<PostSearchResponse>('/search', {
      ...data,
      store: {
        storeId: data.store?._id,
        name: data.store?.name,
        url: data.store?.url,
      },
    })
    .then((res) => res.data)
}

export function suggestionTerms(data: PostSearchRequest) {

  return searchApi.post<SuggestionTermResponse>('/search/autocompletion', { ...data })
}
