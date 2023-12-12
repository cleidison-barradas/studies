import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { Component } from 'react'
import Header from '../../../components/Header'
import LeftSidebar from '../../../components/LeftSidebar'
import notificationContext from '../../../context/NotificationContext'
import { ThemeConsumer } from '../../../context/ThemeContext'
import RouteLink from '../../../interfaces/routeLink'
import Store from '../../../interfaces/store'
import styles from './styles'

type DashboardProps = {
  classes: any
  links: RouteLink[]
  store: Store | null
  loadLinks: () => void
  loadStore: () => Promise<void>
}

interface State {
  sidebarOpen: boolean
  notificationLoaded: boolean
}

class Dashboard extends Component<DashboardProps> {
  static contextType = notificationContext

  static defaultProps = {
    links: [],
    store: undefined,
  }

  state = {
    sidebarOpen: false,
    notificationLoaded: false,
  }

  async componentDidMount() {
    const { loadLinks, loadStore } = this.props
    await loadStore()
    loadLinks()
  }

  async componentDidUpdate(prevProps: DashboardProps, prevState: State) {
    const { getNotification } = this.context

    if (prevProps.store?._id !== this.props.store?._id) {
      if (this.props.store?._id !== undefined) {
        await getNotification(this.props.store?._id)
        this.setState({ notificationLoaded: true })
      }
    }
  }

  toggleDrawerOpen = () => {
    this.setState((state: any) => ({
      ...state,
      sidebarOpen: !state.sidebarOpen,
    }))
  }
  loadTransition = () => null

  render() {
    const { classes, children, links, store } = this.props
    const { sidebarOpen, notificationLoaded } = this.state

    return (
      <ThemeConsumer>
        {({ mode, changeMode }) => (
          <>
            {notificationLoaded && (
              <div className={classNames(classes.appFrameInner, classes.sideNav, mode === 'dark' ? 'dark-mode' : 'light-mode')}>
                <LeftSidebar
                  open={sidebarOpen}
                  links={links}
                  store={store}
                  toggleDrawerOpen={this.toggleDrawerOpen}
                  loadTransition={this.loadTransition}
                />

                <Header toggleDrawerOpen={this.toggleDrawerOpen} margin={sidebarOpen} changeMode={changeMode} mode={mode} />

                <main className={classNames(classes.content, sidebarOpen ? classes.contentPaddingLeft : '')} id="mainContent">
                  <section className={classNames(classes.mainWrap, classes.sidebarLayout)}>{children}</section>
                </main>
              </div>
            )}
          </>
        )}
      </ThemeConsumer>
    )
  }
}

export default withStyles(styles)(Dashboard)
