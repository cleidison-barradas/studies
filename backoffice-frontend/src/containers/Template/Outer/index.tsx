import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import styles from '../styles'

type OuterProps = {
    classes: any
    gradient: boolean
    decoration: boolean
}

class Outer extends Component<OuterProps> {
  render () {
    const { classes, gradient, decoration, children } = this.props

    return (
            <div className={classNames(classes.appFrameOuter, gradient ? classes.gradientBg : classes.solidBg)}>
                <main className={classes.outerContent} id="mainContent">
                    {decoration && <div />}
                    {children}
                </main>
            </div>
    )
  }
}

export default withStyles(styles)(Outer)
