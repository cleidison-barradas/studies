import { Drawer, Hidden, SwipeableDrawer, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Component } from 'react'
import { NotificationConsumer } from '../../context/NotificationContext'
import RouteLink from '../../interfaces/routeLink'
import Store from '../../interfaces/store'
import SidebarContent from './SidebarContent'
import styles from './styles'

type LeftSidebarProps = {
  classes: any
  open: boolean
  links: RouteLink[]
  store: Store | null
  toggleDrawerOpen: any
  loadTransition: any
}

class LeftSidebar extends Component<LeftSidebarProps> {
  static defaultProps = {
    links: [],
    store: undefined,
  }

  state = {
    turnDarker: false,
  }

  // Initial header style
  flagDarker = false

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
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

  render() {
    const { classes, open, links, store, toggleDrawerOpen, loadTransition } = this.props
    const { turnDarker } = this.state

    return (
      <NotificationConsumer>
        {({ notification }) =>
          (notification !== undefined && notification.type !== 'LOCKED') || !notification ? (
            <>
              <Hidden lgUp>
                <SwipeableDrawer
                  onClose={toggleDrawerOpen}
                  onOpen={toggleDrawerOpen}
                  open={open}
                  anchor="left"
                  className={classes.noPrint}
                >
                  <div className={classes.swipeDrawerPaper}>
                    <SidebarContent
                      drawerPaper
                      isOpen={open}
                      store={store}
                      links={links}
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
                    paper: classNames(classes.drawer, classes.drawerPaper, !open ? classes.drawerPaperClose : ''),
                  }}
                  className={classes.noPrint}
                  open={open}
                  anchor="left"
                >
                  <SidebarContent
                    drawerPaper
                    isOpen={open}
                    store={store}
                    links={links}
                    turnDarker={turnDarker}
                    toggleDrawerOpen={toggleDrawerOpen}
                    loadTransition={loadTransition}
                  />
                </Drawer>
              </Hidden>
            </>
          ) : (
            <></>
          )
        }
      </NotificationConsumer>
    )
  }
}

export default withStyles(styles)(LeftSidebar)
