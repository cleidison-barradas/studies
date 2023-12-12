import { AppBar, Fab, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Menu as MenuIcon } from '@material-ui/icons'
import classNames from 'classnames'
import { Component } from 'react'
import { AuthConsumer } from '../../context/AuthContext'
import NotificationContext from '../../context/NotificationContext'
import { ThemeConsumer } from '../../context/ThemeContext'
import { ThemeMode } from '../../interfaces/storageTheme'
import UserMenu from '../UserMenu'
import styles from './styles'

type HeaderProps = {
  classes: any
  margin: boolean
  mode: ThemeMode
  toggleDrawerOpen: any
  changeMode: (mode: ThemeMode) => void
}

type State = {
  open: boolean
  turnDarker: boolean
  showTitle: boolean
  showNotification: boolean
  anchorEl: any
  showTooltip: boolean
}

class Header extends Component<HeaderProps, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      open: false,
      turnDarker: false,
      showTitle: false,
      showNotification: false,
      anchorEl: null,
      showTooltip: false,
    }

    this.handleCloseNotification = this.handleCloseNotification.bind(this)
  }

  flagDarker = false
  flagTitle = false

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  handleCloseNotification() {
    this.setState({
      ...this.state,
      showNotification: !this.state.showNotification,
    })
  }

  handleScroll = () => {
    const doc = document.documentElement
    const scroll = (window.pageXOffset || doc.scrollTop) - (doc.clientTop || 0)
    const newFlagDarker = scroll > 30

    if (this.flagDarker !== newFlagDarker) {
      this.setState({
        turnDarker: newFlagDarker,
      })
    } else {
      this.setState({
        turnDarker: false,
      })
    }
  }

  turnMode = () => {
    const { mode, changeMode } = this.props

    if (mode === 'dark') {
      changeMode('dark')
    } else {
      changeMode('light')
    }
  }

  handleMouseEnter = () => {
    this.setState({ showTooltip: true })
  }

  handleMouseLeave = () => {
    this.setState({ showTooltip: false })
  }

  render() {
    const { classes, margin, toggleDrawerOpen } = this.props
    const { open, turnDarker, showTitle, showTooltip } = this.state

    return (
      <AuthConsumer>
        {({ store, user }) => (
          <ThemeConsumer>
            {({ mode, changeMode }) => (
              <AppBar
                className={classNames(
                  classes.appBar,
                  classes.floatingBar,
                  margin && classes.appBarShift,
                  classes.left,
                  turnDarker && classes.darker,
                  classes.noPrint
                )}
              >
                <Toolbar disableGutters={!open}>
                  <NotificationContext.Consumer>
                    {({ notification }) =>
                      !notification || (notification !== undefined && notification.type !== 'LOCKED') ? (
                        <Fab
                          size="small"
                          className={classes.menuButton}
                          aria-label="Menu"
                          onClick={toggleDrawerOpen}
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}
                        >
                          <MenuIcon />
                        </Fab>
                      ) : (
                        <Tooltip title="Os serviços estão bloqueados" open={showTooltip}>
                          <Fab
                            size="small"
                            className={classes.menuButton}
                            aria-label="Menu"
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}
                            style={{
                              cursor: 'not-allowed',
                            }}
                          >
                            <MenuIcon color="disabled" />
                          </Fab>
                        </Tooltip>
                      )
                    }
                  </NotificationContext.Consumer>
                  <div className={classes.headerProperties}>
                    <div className={classNames(classes.headerAction, showTitle)}>
                      <div className={classes.headerSpacing}>
                        <div>
                          <Tooltip title={mode === 'light' ? 'Modo Noturno' : 'Modo Claro'} placement="bottom">
                            <IconButton
                              className={classes.button}
                              onClick={() => (mode === 'light' ? changeMode('dark') : changeMode('light'))}
                            >
                              <img src={require(`../../assets/images/lamp.svg`).default} alt="" />
                            </IconButton>
                          </Tooltip>
                        </div>
                        <Typography className={classes.storeName} color="primary">
                          {' '}
                          {store?.name} ({store?.plan?.name})
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', height: 32 }}>
                          <div className={classes.userButtons}>
                            <Typography className={classes.storeName} color="primary">
                              {user?.userName}
                            </Typography>
                            <UserMenu />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Toolbar>
              </AppBar>
            )}
          </ThemeConsumer>
        )}
      </AuthConsumer>
    )
  }
}

export default withStyles(styles)(Header)
