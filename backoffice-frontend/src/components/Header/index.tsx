import React, { Component } from 'react'
import classNames from 'classnames'
import { AppBar, Toolbar, Fab, Tooltip, IconButton } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import UserMenu from '../UserMenu'
import BlueLampIcon from '../../assets/images/icons/header/blueLamp.svg'
import WhiteLampIcon from '../../assets/images/icons/header/whiteLamp.svg'

type HeaderProps = {
    classes: any
    margin: boolean
    mode: string
    title: string
    toggleDrawerOpen: any
    changeMode: (mode: string) => void
}

type State = {
    open: boolean
    turnDarker: boolean
    showNotification: boolean
    anchorEl: any
}

class Header extends Component<HeaderProps, State> {
  constructor (props: any) {
    super(props)

    this.state = {
      open: false,
      turnDarker: false,
      showNotification: false,
      anchorEl: null
    }
  }

    flagDarker = false

    componentDidMount () {
      window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount () {
      window.addEventListener('scroll', this.handleScroll)
    }

    handleScroll = () => {
      const doc = document.documentElement
      const scroll = (window.pageXOffset || doc.scrollTop) - (doc.clientTop || 0)
      const newFlagDarker = scroll > 30

      if (this.flagDarker !== newFlagDarker) {
        this.setState({
          turnDarker: newFlagDarker
        })
      } else {
        this.setState({
          turnDarker: false
        })
      }
    }

    turnMode = () => {
      const { mode, changeMode } = this.props
      if (mode === 'light') {
        changeMode('dark')
      } else {
        changeMode('light')
      }
    }

    render () {
      const { classes, margin, mode, toggleDrawerOpen } = this.props

      const { open, turnDarker } = this.state

      return (
            <AppBar
                className={classNames(
                  classes.appBar,
                  classes.floatingBar,
                  margin && classes.appBarShift,
                  classes.left,
                  turnDarker && classes.darker
                )}
            >
                <Toolbar disableGutters={!open}>
                    <Fab size="small" className={classes.menuButton} aria-label="Menu" onClick={toggleDrawerOpen}>
                        <MenuIcon />
                    </Fab>

                    <div className={classes.headerProperties}>
                        <div className={classes.headerAction}>
                            <div className={classes.headerSpacing}>
                                <div>
                                    <Tooltip
                                        title={mode === 'light' ? 'Modo Noturno' : 'Modo Claro'}
                                        placement="bottom"
                                    >
                                        <IconButton className={classes.button} onClick={this.turnMode}>
                                            <img src={mode === 'light' ? BlueLampIcon : WhiteLampIcon} alt="" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', height: 32 }}>
                                    <div className={classes.userButtons}>
                                        <UserMenu />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
      )
    }
}

export default withStyles(styles)(Header)
