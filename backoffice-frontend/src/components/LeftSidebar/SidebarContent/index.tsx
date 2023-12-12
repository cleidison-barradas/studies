import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import styles from '../styles'
import links, { SideBarLink as SideBarLinkInterface } from '../../../navigation/sideBarLinks'
import SideBarLink from '../../SideBarLink'

interface SidebarContentProps {
    classes: any
    drawerPaper: boolean
    turnDarker?: boolean
    isOpen: any
    toggleDrawerOpen?: any
    loadTransition?: any
}

class SidebarContent extends Component<SidebarContentProps> {
    static defaultProps = {
      turnDarker: false
    }

    state = {
      transform: 0
    }

    componentDidMount () {
      // Scroll content to top
      const mainContent = document.getElementById('sidebar')
      mainContent?.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount () {
      const mainContent = document.getElementById('sidebar')
      mainContent?.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll = (event: any) => {
      const scroll = event.target.scrollTop

      this.setState({
        transform: scroll
      })
    }

    render () {
      const { classes, turnDarker, drawerPaper, isOpen } = this.props
      return (
            <div className={classNames(classes.drawerInner, !drawerPaper ? classes.drawerPaperClose : '')}>
                <div className={classes.drawerHeader}>
                    {isOpen && (
                        <Link
                            to="/"
                            className={classNames(classes.brand, classes.brandBar, turnDarker && classes.darker)}
                        >
                            <img src={mypharmaLogo} alt="MyPharma" />
                        </Link>
                    )}
                </div>

                <div id="sidebar" className={classNames(classes.menuContainer, classes.rounded, classes.withProfile)}>
                    {links.map((link: SideBarLinkInterface, index: any) => (
                        <SideBarLink link={link} key={index} sideBarOpen={isOpen} />
                    ))}
                </div>
            </div>
      )
    }
}

export default withStyles(styles)(SidebarContent)
