import React, { Component } from 'react'
import classNames from 'classnames'
import { Hidden, Drawer, SwipeableDrawer } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SidebarContent from './SidebarContent'
import styles from './styles'

interface LeftSidebarProps {
    classes: any
    open: boolean
    toggleDrawerOpen: any
    loadTransition: any
}

class LeftSidebar extends Component<LeftSidebarProps> {
    state = {
      turnDarker: false
    }

    // Initial header style
    flagDarker = false

    componentDidMount = () => {
      window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount () {
      window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll = () => {
      const doc = document.documentElement
      const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
      const newFlagDarker = scroll > 30

      if (this.flagDarker !== newFlagDarker) {
        this.setState({ turnDarker: newFlagDarker })
        this.flagDarker = newFlagDarker
      }
    }

    render () {
      const { classes, open, toggleDrawerOpen, loadTransition } = this.props
      const { turnDarker } = this.state
      return (
            <>
                <Hidden lgUp>
                    <SwipeableDrawer onClose={toggleDrawerOpen} onOpen={toggleDrawerOpen} open={open} anchor="left">
                        <div className={classes.swipeDrawerPaper}>
                            <SidebarContent
                                isOpen={open}
                                drawerPaper
                                toggleDrawerOpen={toggleDrawerOpen}
                                loadTransition={loadTransition}
                            />
                        </div>
                    </SwipeableDrawer>
                </Hidden>
                <Hidden mdDown>
                    <Drawer
                        variant="permanent"
                        onClose={toggleDrawerOpen}
                        classes={{
                          paper: classNames(
                            classes.drawer,
                            classes.drawerPaper,
                            !open ? classes.drawerPaperClose : ''
                          )
                        }}
                        open={open}
                        anchor="left"
                    >
                        <SidebarContent
                            isOpen={open}
                            drawerPaper
                            turnDarker={turnDarker}
                            toggleDrawerOpen={toggleDrawerOpen}
                            loadTransition={loadTransition}
                        />
                    </Drawer>
                </Hidden>
            </>
      )
    }
}

export default withStyles(styles)(LeftSidebar)
