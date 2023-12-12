import React, { useContext, useEffect, useState } from 'react'
import { ThemeProvider as LocalThemeProvider } from '../../components/ThemeProvider'
import { ThemeProvider } from '@mypharma/react-components'
import { TabBarProvider } from '../../contexts/tabbar.context'
import { Container, InnerContainer } from './styles'
import AuthContext from '../../contexts/auth.context'
import { WhatsappButton } from '../../components/WhatsappButton'
import { CartDrawer } from '../../components/CartDrawer'
import { ThemeProvider as MuiThemeProvider } from '@mui/material'
import { CreateMuiTheme } from '../../helpers/createMuiTheme'
import { AlertProvider } from '../../contexts/alert.context'
import { makePalette } from '../../helpers/makePalette'
import { MenuDrawer } from '../../components/MenuDrawer'
import { CookieProvider } from '../../contexts/cookies.context'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useLocation } from 'react-router'
import { LayoutContext, LayoutProvider } from '../../contexts/layout.context'
import { DownloadAppPopup } from '../../components/DownloadAppPopup'
import { useSearchParams } from 'react-router-dom'
import Theme from '../../interfaces/theme/Theme'

export const Layout: React.FC = ({ children }) => {
  const { store } = useContext(AuthContext)
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [queryTheme, setQueryTheme] = useState<Theme | null>(null)

  const theme = makePalette({
    primary: store?.settings.config_navbar_color || '#0B6AF2',
    secondary: store?.settings.config_secondary_color || '#37b910',
    cta: store?.settings.config_navbar_text_color || '#fffff',
    footerTextColor: store?.settings.config_footer_text_color || '#FFFF',
    headerTextColor: store?.settings.config_header_text_color || '#FFFF',
  })

  useEffect(() => {
    if (searchParams.get('color') && !queryTheme) {
      const color = searchParams.get('color')
      const secondary = searchParams.get('secondary')
      const text = searchParams.get('text')
      const textFooter = searchParams.get('textFooter')
      const textHeader = searchParams.get('textHeader')

      const customTheme = makePalette({
        primary: color ? '#' + color : store?.settings.config_navbar_color || '#0B6AF2',
        secondary: secondary
          ? '#' + secondary
          : store?.settings.config_secondary_color || '#37b910',
        cta: text ? '#' + text : store?.settings.config_navbar_text_color || '#fffff',
        footerTextColor: textFooter
          ? '#' + textFooter
          : store?.settings.config_footer_text_color || '#fffff',
        headerTextColor: textHeader
          ? '#' + textHeader
          : store?.settings.config_header_text_color || '#fffff',
      })
      setQueryTheme(customTheme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, store])

  return (
    <ThemeProvider theme={queryTheme || theme}>
      <LocalThemeProvider theme={queryTheme || theme}>
        <MuiThemeProvider theme={CreateMuiTheme(queryTheme || theme)}>
          <AlertProvider>
            <CookieProvider>
              <LayoutProvider>
                <LayoutContext.Consumer>
                  {({ isHeaderHidden, isFooterHidden, isContainerHidden }) =>
                    pathname !== '/checkout' ? (
                      <TabBarProvider>
                        {!isHeaderHidden && <Header />}
                        <MenuDrawer />
                        <CartDrawer />
                        {isContainerHidden ? (
                          children
                        ) : (
                          <Container
                            isHeaderHidden={isHeaderHidden}
                            isFooterHidden={isFooterHidden}
                          >
                            <InnerContainer>{children}</InnerContainer>
                          </Container>
                        )}
                        {!isContainerHidden &&
                          store?.settings.config_whatsapp_button &&
                          !pathname.includes('/produtos/') && <WhatsappButton />}
                        {!isFooterHidden && <Footer />}
                        <div style={{ justifyContent: ' center' }}>
                          <DownloadAppPopup tenant={store ? store.tenant : ''} />
                        </div>
                      </TabBarProvider>
                    ) : (
                      children
                    )
                  }
                </LayoutContext.Consumer>
              </LayoutProvider>
            </CookieProvider>
          </AlertProvider>
        </MuiThemeProvider>
      </LocalThemeProvider>
    </ThemeProvider>
  )
}
