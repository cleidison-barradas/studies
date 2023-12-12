import { Stack, IconButton } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from 'styled-components'
import { ClockIcon, CloseIcon } from '../../assets/icons'
import { useSearch } from '../../hooks/useSearch'
import { removeQueryHistory } from '../../services/searchHistory/searchHistory.service'
import { QuerySuggestionLink } from './styles'

interface QueryHistoryLinkProps {
  value: string
  onClick: () => void
}

export const QueryHistoryLink: React.FC<QueryHistoryLinkProps> = ({ value , onClick}) => {
  const { search } = useSearch()
  const { color } = useTheme()
  const navigate = useNavigate()

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <QuerySuggestionLink
        onClick={() => {
          search(value)
          navigate(`/produtos?q=${value}`)
          onClick()
        }}
        to={`/produtos?q=${value}`}
      >
        <ClockIcon height={18} color="inherit" /> {value}
      </QuerySuggestionLink>
      <IconButton onMouseDown={() => removeQueryHistory(value)}>
        <CloseIcon height={18} color={color.neutral.medium} />
      </IconButton>
    </Stack>
  )
}
