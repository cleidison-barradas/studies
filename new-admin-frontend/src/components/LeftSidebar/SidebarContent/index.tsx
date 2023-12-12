import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import styles from '../styles'
import SideBarLink from '../../SideBarLink'
import Store from '../../../interfaces/store'
import RouteLink from '../../../interfaces/routeLink'

type SidebarContentProps = {
  classes: any
  isOpen: boolean
  links: RouteLink[]
  store: Store | null
  drawerPaper: boolean
  turnDarker?: boolean
  toggleDrawerOpen?: any
  loadTransition?: any
}

class SidebarContent extends Component<SidebarContentProps> {
  static defaultProps = {
    turnDarker: false,
    links: [],
    store: undefined,
  }

  state = {
    transform: 0,
  }

  componentDidMount() {
    // Scroll content to top
    const mainContent = document.getElementById('sidebar')
    mainContent?.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    const mainContent = document.getElementById('sidebar')
    mainContent?.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (event: any) => {
    const scroll = event.target.scrollTop

    this.setState({
      transform: scroll,
    })
  }

  render() {
    const { classes, links, turnDarker, drawerPaper, store, isOpen, toggleDrawerOpen } = this.props
    return (
      <div className={classNames(classes.drawerInner, !drawerPaper ? classes.drawerPaperClose : '')}>
        <div className={classes.drawerHeader}>
          {isOpen && (
            <Link to="/" className={classNames(classes.brand, classes.brandBar, turnDarker && classes.darker)}>
              <img src={mypharmaLogo} alt="MyPharma" />
            </Link>
          )}
        </div>
        <div id="sidebar" className={classNames(classes.menuContainer, classes.rounded, classes.withProfile)}>
          {links
            .sort((a, b) => (a.sort < b.sort ? -1 : 1))
            .map((link: RouteLink, index: number) => (
              <SideBarLink toggleDrawerOpen={toggleDrawerOpen} link={link} key={index} sideBarOpen={isOpen} plan={store?.plan} />
            ))}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(SidebarContent)
