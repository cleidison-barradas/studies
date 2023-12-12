import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { UserIcon } from '../../assets/icons'
import AuthContext from '../../contexts/auth.context'
import { LoginForm } from '../../forms/LoginForm'
import { IconContainer, MenuContainer, UserContainer, MenuBody, CategoryBtn } from './styles'
import { MenuOptionsContainer } from '../MenuOptionsContainer'
import { getCategory } from '../../services/category/category.service'
import useSWR from 'swr'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { orderByPriority } from '../CategoryContainer'
import { useTheme } from 'styled-components'

interface MenuContainerProps {
  handleClose: (event?: any) => void
}

export const Menu: React.FC<MenuContainerProps> = ({ handleClose }) => {
  const { user } = useContext(AuthContext)
  const { pathname } = useLocation()
  const [initialPath, setInitialPath] = useState('')
  const [selected, setSelected] = useState<React.ReactNode | undefined>()
  const [isLogin, setIsLogin] = useState(false)
  const [hideMenuHeader, setHideMenuHeader] = useState(false)
  const { data } = useSWR('categorys', () => getCategory())
  const navigate = useNavigate()
  const { color } = useTheme()

  useEffect(() => {
    setInitialPath(pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isLogin && user) setIsLogin(false)
  }, [user, isLogin])

  useEffect(() => {
    if (initialPath !== '' && pathname !== initialPath) handleClose()
  }, [pathname, handleClose, initialPath])

  const toggleMenuHeader = () => {
    setHideMenuHeader((value) => !value)
  }

  const navigateToCategory = (slug: string) => {
    navigate(`/departamentos/${slug}`)
  }

  useEffect(() => {
    if (isLogin && hideMenuHeader === false) toggleMenuHeader()
  }, [isLogin, hideMenuHeader])

  return (
    <MenuContainer>
      {hideMenuHeader === false && (
        <React.Fragment>
          <UserContainer>
            <IconContainer>
              <UserIcon color={color.headerTextColor} />
            </IconContainer>
            <Stack>
              {user ? (
                <React.Fragment>
                  <Typography className="username">{user.firstname}</Typography>
                  <Typography className="useremail">{user.email}</Typography>
                </React.Fragment>
              ) : (
                <Stack spacing={1}>
                  <Typography className="username">Olá, visitante!</Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      style={{ textDecoration: 'underline', fontSize: 14, padding: 0 }}
                      color="primary"
                      onClick={() => navigate('/login')}
                    >
                      Entrar
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </UserContainer>
          <Divider />
        </React.Fragment>
      )}
      <MenuBody>
        {isLogin ? (
          <LoginForm />
        ) : selected ? (
          selected
        ) : (
          <MenuOptionsContainer handleClose={handleClose} setSelected={setSelected} />
        )}
        {data?.categorys && (
          <Box overflow={'auto'} mt={5}>
            {orderByPriority(data.categorys).map((value) => (
              <CategoryBtn onClick={() => navigateToCategory(value.slug)} key={value._id}>
                {value.name}
                <ArrowForwardIosIcon color="inherit" style={{ height: 16 }} />
              </CategoryBtn>
            ))}
          </Box>
        )}
      </MenuBody>
    </MenuContainer>
  )
}
