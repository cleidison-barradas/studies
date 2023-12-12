import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ButtonIcon, Container, Logo, MenuButton } from './styles'
import AuthContext from '../../contexts/auth.context'
import { MenuIcon, BasketIcon } from '../../assets/icons'
import { Search } from '../../components/Search'
import { DeliveryRegionsDropdown } from '../../components/DeliveryRegionsDropdown'
import CartContext from '../../contexts/cart.context'
import { UserDropdown } from '../UserDropdown'
import MenuContext from '../../contexts/menu.context'
import { CDN } from '../../config/keys'
import { useLocation, useNavigate } from 'react-router'
import { Button, Chip, Hidden, Stack, Tooltip } from '@mui/material'
import { useTheme } from 'styled-components'
import { useCart } from '../../hooks/useCart'
import { InnerContainer } from '../../containers/Layout/styles'

export const Header: React.FC = () => {
  const { store, user } = useContext(AuthContext)
  const { setOpen, cart, notify } = useContext(CartContext)
  const { setOpen: setMenuOpen } = useContext(MenuContext)

  const [hide, setHide] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { color } = useTheme()
  const { getProductsQuantity } = useCart()

  const handleScroll = useCallback(() => {
    const doc = document.documentElement
    const scroll = (window.pageXOffset || doc.scrollTop) - (doc.clientTop || 0)
    const shouldHide = scroll > 30

    if (window.innerWidth < 1200 && hide === false && shouldHide) {
      setHide(true)
    }

    if (hide === true && !shouldHide) {
      setHide(false)
    }
  }, [hide])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <Container>
      <InnerContainer>
        <Stack
          justifyContent={{ xs: 'center', sm: 'flex-start' }}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          spacing={{ xs: 1, sm: 3, md: 1 }}
        >
          <Stack direction="row" spacing={4} width={{ xs: '100%' }}>
            <Stack
              direction="row"
              alignItems={{ md: 'center' }}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
              flex={1}
              gap={4}
              width={{ xs: '100%' }}
            >
              <Hidden smDown mdUp>
                <MenuButton onClick={() => (user ? setMenuOpen(true) : navigate('/login'))}>
                  <MenuIcon />
                </MenuButton>
              </Hidden>
              {!hide && (
                <Button onClick={() => navigate('/produtos')}>
                  <Logo alt={store?.name} src={`${CDN.image}${store?.settings.config_logo}`} />
                </Button>
              )}
              <Hidden lgDown>
                <Search />
              </Hidden>
            </Stack>
            <Hidden smDown>
              <Stack direction="row" gap="27px" alignItems="center" right="23px">
                {pathname === '/produtos' && (
                  <Hidden mdDown>
                    <DeliveryRegionsDropdown />
                  </Hidden>
                )}
                <Hidden mdDown>
                  <MenuButton>
                    <UserDropdown />
                  </MenuButton>
                </Hidden>
                <Hidden smDown>
                  <Tooltip
                    PopperProps={{ keepMounted: true }}
                    placement="top"
                    title={notify.text}
                    arrow
                    componentsProps={{
                      tooltip: {
                        style: {
                          fontSize: 14,
                          fontFamily: 'Poppins,sans-serif',
                          color: color.cta,
                          background: color.secondary.medium,
                        },
                      },
                      arrow: {
                        style: {
                          color: color.secondary.medium,
                        },
                      },
                    }}
                    open={notify.open}
                  >
                    <MenuButton
                      onClick={() => setOpen(true)}
                      style={{ color: color.headerTextColor }}
                    >
                      {cart.products!.length > 0 && (
                        <ButtonIcon>
                          <Chip
                            style={{ color: color.cta }}
                            variant="filled"
                            label={getProductsQuantity()}
                            size="small"
                          />
                        </ButtonIcon>
                      )}
                      <BasketIcon />
                      Cesta
                    </MenuButton>
                  </Tooltip>
                </Hidden>
              </Stack>
            </Hidden>
          </Stack>
          <Hidden lgUp>
            <Search />
          </Hidden>
        </Stack>
        {!hide && pathname === '/produtos' && (
          <Hidden mdUp>
            <DeliveryRegionsDropdown />
          </Hidden>
        )}
      </InnerContainer>
    </Container>
  )
}
