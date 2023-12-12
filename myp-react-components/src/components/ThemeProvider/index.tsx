import React from 'react'
import { ThemeProvider as StyledProvider } from 'styled-components'
import { GlobalStyles } from '..'
import { makePalette } from '../../helpers/makePalette'
import Theme from '../../interfaces/Theme'

interface ThemeProviderProps {
  theme?: Theme
}

const defaultValue: Theme = makePalette({
  primary: '#0B6AF2',
  secondary: '#F7EB1B',
})

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme = defaultValue,
}) => {
  return (
    <StyledProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledProvider>
  )
}
