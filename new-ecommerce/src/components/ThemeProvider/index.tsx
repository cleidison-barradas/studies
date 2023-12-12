import { GlobalStyles } from '@mypharma/react-components'
import React from 'react'
import { ThemeProvider as StyledProvider } from 'styled-components'
import { makePalette } from '../../helpers/makePalette'
import Theme from '../../interfaces/theme/Theme'

interface ThemeProviderProps {
  theme?: Theme
}

const defaultValue: Theme = makePalette({
  primary: '#0B6AF2',
  secondary: '#F7EB1B',
  cta: '#fffff',
  footerTextColor: '#fffff',
  headerTextColor: '#fffff',
})

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, theme = defaultValue }) => {
  return (
    <StyledProvider theme={theme}>
      <GlobalStyles />
      {children}
    </StyledProvider>
  )
}
