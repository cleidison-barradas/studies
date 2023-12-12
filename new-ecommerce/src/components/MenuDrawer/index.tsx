import React, { useContext } from 'react'
import { Hidden, SwipeableDrawer } from '@mui/material'
import MenuContext from '../../contexts/menu.context'
import { Menu } from '../Menu'
import { CloseButton, MenuHeader, MobileModal } from './styles'
import { CloseIcon } from '../../assets/icons'

export const MenuDrawer: React.FC = () => {
  const { open, setOpen } = useContext(MenuContext)

  const closeDrawer = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Hidden smDown mdUp>
        <SwipeableDrawer
          onOpen={() => setOpen(true)}
          open={open}
          onClose={closeDrawer}
          anchor={'left'}
        >
          <Menu handleClose={closeDrawer} />
        </SwipeableDrawer>
      </Hidden>
      <Hidden smUp>
        {open && (
          <MobileModal open={open}>
            <MenuHeader>
              Menu
              <CloseButton onClick={closeDrawer}>
                <CloseIcon height={26} />
              </CloseButton>
            </MenuHeader>
            <Menu handleClose={closeDrawer} />
          </MobileModal>
        )}
      </Hidden>
    </React.Fragment>
  )
}
