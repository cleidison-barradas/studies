import React, { useContext, useEffect } from 'react'
import AuthContext from '../../contexts/auth.context'
import { useNavigate } from 'react-router'
import { SearchIcon } from '../../assets/icons'

import { Wrapper, IconWrapper, SearchSuggestItem } from './styles'
import {
  SearchSuggestOption,
  SearchSuggestContianer
} from './styles'

import { SearchPaper } from '../SearchPaper'
import {
  debounce,
  TextField,
  Autocomplete,
  AutocompleteInputChangeReason
} from '@mui/material'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'


import { useEC } from '../../hooks/useEC'
import { useSearch } from '../../hooks/useSearch'

export const Search = () => {
  const { store } = useContext(AuthContext)
  const { products = [], suggestion = [], suggestions, search, clearSuggestions } = useSearch()
  const navigate = useNavigate()
  const { addImpression } = useEC()

  const open = suggestion.length > 0

  const onInputChange = debounce(
    async (
      event: React.SyntheticEvent<Element, Event>,
      value: string,
      reason: AutocompleteInputChangeReason
    ) => {
      const term = value || ''

      if (event.type === 'click') {

        return clearSuggestions()
      }

      if (event.type === 'change' && term.trim().length <= 0) {

        return clearSuggestions()
      }

      if (event.type === 'change' && term.trim().length > 0) {

        await suggestions(value)
      }
    },
    400
  )

  const onSubmitForm = async (event: any) => {
    event.preventDefault()
    const term = String(event.target[0].value)

    if (term && term.trim().length > 0) {

      await search(term)
      window.scrollTo(0, 0)
      navigate(`/produtos?q=${term}`)

      if (document.activeElement) (document.activeElement as any).blur()
    }
  }

  const searchByTerm = async (term: string) => {
    if (document.activeElement) (document.activeElement as any).blur()

    await search(term)
    window.scrollTo(0, 0)
    navigate(`/produtos?q=${term}`)
  }

  useEffect(() => {
    if (products) addImpression(products.slice(0, 10), 'search-input')
  }, [addImpression, products])

  return (
    <Wrapper action="." onSubmit={onSubmitForm} role="search">
      <Autocomplete
        fullWidth
        open={open}
        disableListWrap
        clearOnBlur={false}
        options={suggestion}
        onInputChange={onInputChange}
        popupIcon={<React.Fragment />}
        clearIcon={<React.Fragment />}
        filterOptions={options => options}
        getOptionLabel={suggest => suggest.text}
        PaperComponent={({ children }) =>
          <SearchPaper
            children={children}
            onClose={clearSuggestions}
          />
        }
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option.text, inputValue, { insideWords: true })
          const parts = parse(option.text, matches)

          return (
            <SearchSuggestContianer {...props}>
              <SearchSuggestItem onClick={async () => await searchByTerm(option.text)} >
                <SearchIcon style={{ height: 14, width: 14, color: '#474F57', marginRight: 6 }} />
                {parts.map((part, index) => (
                  <SearchSuggestOption key={index} highLight={part.highlight}>
                    {part.text}
                  </SearchSuggestOption>
                ))}
              </SearchSuggestItem>
            </SearchSuggestContianer>
          )
        }}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <TextField
              {...params}
              type="search"
              placeholder={`Busque na ${store?.name}`}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <IconWrapper>
                    <SearchIcon />
                  </IconWrapper>
                ),
              }}
              onKeyDown={(event: any) => {
                if (event.key === 'Enter') {
                  event.defaultMuiPrevented = true

                  const query = String(event.target.value)

                  if (query && query.trim().length > 0) {
                    clearSuggestions()
                    navigate(`/produtos?q=${query}`)
                  }
                }
              }}
            />
          </div>
        )}
      />
    </Wrapper>
  )
}
