import { alpha, Chip, Hidden, Tooltip } from '@mui/material'
import React, { useContext } from 'react'
import { BasketIcon, HomeIcon, TabMenuIcon, UserIcon } from '../../assets/icons'
import { ButtonIcon, Container, TabBarButton, TooltipWrapper } from './styles'
import { useTheme } from 'styled-components'
import { useLocation, useNavigate } from 'react-router'
import CartContext from '../../contexts/cart.context'
import MenuContext from '../../contexts/menu.context'
import AuthContext from '../../contexts/auth.context'
import { useCart } from '../../hooks/useCart'

export const TabBar: React.FC = ({ children }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { open, setOpen, notify, cart } = useContext(CartContext)
  const { open: menuOpen, setOpen: setMenuOpen } = useContext(MenuContext)
  const { user } = useContext(AuthContext)
  const { color } = useTheme()
  const { getProductsQuantity } = useCart()

  const onClickTabbarButton = (path: string) => {
    if (menuOpen) setMenuOpen(false)
    navigate(path)
  }

  return (
    <Hidden smUp>
      <Container>
        <Container>
          <TabBarButton
            onClick={() => onClickTabbarButton('/produtos')}
            active={!menuOpen && pathname === '/produtos'}
          >
            <HomeIcon />
            Início
          </TabBarButton>
          <TabBarButton
            onClick={() => onClickTabbarButton(user ? '/profile' : '/login')}
            active={!menuOpen && (pathname === '/profile' || pathname === '/login')}
          >
            <UserIcon />
            sua conta
          </TabBarButton>
          <TooltipWrapper>
            <Tooltip
              PopperProps={{ keepMounted: true }}
              placement="top"
              title={notify.text}
              arrow
              componentsProps={{
                tooltip: {
                  style: {
                    fontSize: 12,
                    fontFamily: 'Poppins,sans-serif',
                    color: color.cta,
                    background: alpha(color.secondary.medium, 0.89),
                  },
                },
                arrow: {
                  style: {
                    color: alpha(color.secondary.medium, 0.98),
                  },
                },
              }}
              open={notify.open}
            >
              <TabBarButton onClick={() => setOpen(!open)} active={open}>
                {cart.products!.length > 0 && (
                  <ButtonIcon>
                    <Chip
                      variant="filled"
                      style={{ minWidth: 24 }}
                      label={getProductsQuantity()}
                      size="small"
                    />
                  </ButtonIcon>
                )}
                <BasketIcon />
                cesta
              </TabBarButton>
            </Tooltip>
          </TooltipWrapper>
          <TabBarButton onClick={() => setMenuOpen(!menuOpen)} active={menuOpen}>
            <TabMenuIcon />
            menu
          </TabBarButton>
        </Container>
      </Container>
    </Hidden>
  )
}

export { TabBarButton } from './styles'
