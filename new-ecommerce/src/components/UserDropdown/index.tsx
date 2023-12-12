import React, { useContext, useState } from 'react'
import { UserIcon } from '../../assets/icons'
import { Popper, Grow, Box, ClickAwayListener } from '@mui/material'
import { Container, PopperContainer } from './styles'
import AuthContext from '../../contexts/auth.context'
import { Menu } from '../Menu'
import { useTheme } from 'styled-components'

export const UserDropdown: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user } = useContext(AuthContext)
  const { color } = useTheme()

  const handleClick = (event?: any) => {
    setOpen((isOpen) => !isOpen)
    setAnchorEl(anchorEl ? null : event?.currentTarget)
  }

  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <Container onClick={handleClick} style={{ color: color.headerTextColor }}>
        <UserIcon color={color.headerTextColor} />
        {user ? 'Sua conta' : 'Entrar'}
      </Container>
      <Popper transition open={open} style={{ zIndex: 2 }} anchorEl={anchorEl}>
        {({ TransitionProps }) => (
          <ClickAwayListener disableReactTree onClickAway={handleClose}>
            <Grow {...TransitionProps}>
              <PopperContainer>
                <Box display="flex" width="100%" justifyContent="center">
                  <Menu handleClose={handleClose} />
                </Box>
              </PopperContainer>
            </Grow>
          </ClickAwayListener>
        )}
      </Popper>
    </React.Fragment>
  )
}
