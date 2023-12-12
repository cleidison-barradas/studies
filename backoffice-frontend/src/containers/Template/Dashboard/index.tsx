import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Header from '../../../components/Header'
import LeftSidebar from '../../../components/LeftSidebar'
import styles from '../styles'

type DashboardProps = {
    classes: any
    history: any
    mode: any
    place: any
    bgPosition: any
    changeMode: any
}

class Dashboard extends Component<DashboardProps> {
    state = {
      sidebarOpen: false
    }

    toggleDrawerOpen = () => {
      this.setState((state: any) => ({
        ...state,
        sidebarOpen: !state.sidebarOpen
      }))
    }

    loadTransition = () => null

    render () {
      const { classes, changeMode, mode, place, children } = this.props
      const { sidebarOpen } = this.state

      return (
            <div
                className={classNames(
                  classes.appFrameInner,
                  classes.sideNav,
                  mode === 'dark' ? 'dark-mode' : 'light-mode'
                )}
            >
                <LeftSidebar
                    open={sidebarOpen}
                    toggleDrawerOpen={this.toggleDrawerOpen}
                    loadTransition={this.loadTransition}
                />

                <Header
                    toggleDrawerOpen={this.toggleDrawerOpen}
                    margin={sidebarOpen}
                    changeMode={changeMode}
                    mode={mode}
                    title={place}
                />

                <main
                    className={classNames(classes.content, sidebarOpen ? classes.contentPaddingLeft : '')}
                    id="mainContent"
                >
                    <section className={classNames(classes.mainWrap, classes.sidebarLayout)}>{children}</section>
                </main>
            </div>
      )
    }
}

export default withStyles(styles)(Dashboard)
