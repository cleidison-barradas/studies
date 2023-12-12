import { CircularProgress, Paper, Stack } from '@mui/material'
import React, { ReactNode } from 'react'
import Product from '../../interfaces/product'
import { loadStorage } from '../../services/storage/storage.service'
import { SearchContainer, SearchCaption, Arrow } from './styles'
import { ProductHistorySearchLink } from '../ProductHistorySearchLink'
import { QueryHistoryLink } from '../QueryHistoryLink'
import { useSearch } from '../../hooks/useSearch'
import { ISearchHistory } from '../../interfaces/searchHistory'
import { StorageKeys } from '../../config/keys'

type SearchPaperProps = {
  children: ReactNode,
  onClose: () => void
}

export const SearchPaper = ({ children, onClose }: SearchPaperProps) => {
  const history = loadStorage<ISearchHistory>(StorageKeys.search)
  const { suggestion } = useSearch()
  const { isValidating } = useSearch()

  return (
    <Paper>
      <Arrow />
      <SearchContainer>
        {suggestion.length > 0 ? (
          <React.Fragment>
            <Stack direction="row" alignItems="center" gap={1}>
              <SearchCaption>Sugestões de Pesquisa</SearchCaption>
              {isValidating && <CircularProgress size={18} />}
            </Stack>
            {children}
          </React.Fragment>
        ) : history &&
        <React.Fragment>
          {history.queryHistory && history.queryHistory.length > 0 && (
            <Stack>
              <SearchCaption> Suas últimas pesquisas </SearchCaption>
              {history?.queryHistory?.map((value: string, index: number) => (
                <QueryHistoryLink onClick={onClose} value={value} key={index} />
              ))}
            </Stack>
          )}
          {history.productHistory && history.productHistory.length > 0 && (
            <Stack spacing={1}>
              <SearchCaption> Últimos produtos que você visitou </SearchCaption>
              <Stack direction="row" spacing={1}>
                {history.productHistory.map(({ name, image, slug, _id, updateOrigin }: Product) => (
                  <ProductHistorySearchLink
                    name={name}
                    image={image}
                    slug={slug as any}
                    onClick={onClose}
                    updateOrigin={updateOrigin}
                    _id={_id}
                    key={_id}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </React.Fragment>
        }
      </SearchContainer>
    </Paper>
  )
}
