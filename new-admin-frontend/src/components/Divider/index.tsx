import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'

type DividerProps = {
  thin?: number,
  content?: any,
  classes: any
}

/* Gradient Divider */
class Gradient extends Component<DividerProps> {
  static defaultProps = {
    thin: 1
  }

  render() {
    const { thin, classes, ...rest } = this.props

    return <hr className={classes.gradient} style={{ height: `${thin}` }} {...rest} />
  }
}

/* Dash Divider */
class Dash extends Component<DividerProps> {
  static defaultProps = {
    thin: 1
  }

  render() {
    const { thin, classes, ...rest } = this.props

    return <hr className={classes.colorDash} style={{ height: `${thin}` }} {...rest} />
  }
}

/* Shadow Divider */
class Shadow extends Component<DividerProps> {
  static defaultProps = {
    thin: 1
  }

  render() {
    const { thin, classes, ...rest } = this.props

    return <hr className={classes.shadow} style={{ height: `${thin}` }} {...rest} />
  }
}

/* Shadow Inset */
class Inset extends Component<DividerProps> {
  static defaultProps = {
    thin: 1
  }

  render() {
    const { thin, classes, ...rest } = this.props

    return <hr className={classes.inset} style={{ height: `${thin}` }} {...rest} />
  }
}

/* Shadow FlairedEdges */
class FlairedEdges extends Component<DividerProps> {
  static defaultProps = {
    thin: 1
  }

  render() {
    const { thin, classes, ...rest } = this.props

    return <hr className={classes.flairedEdges} style={{ height: `${thin}` }} {...rest} />
  }
}

/* Content */
class Content extends Component<DividerProps> {
  static defaultProps = {
    thin: 1
  }

  render() {
    const { thin, classes, content, ...rest } = this.props

    return  <hr className={classes.content} style={{ height: `${thin}` }} data-content={content} {...rest} />
  }
}

/**
 * Exports
 */
export const GradientDivider = withStyles(styles)(Gradient)
export const DashDivider = withStyles(styles)(Dash)
export const ShadowDivider = withStyles(styles)(Shadow)
export const InsetDivider = withStyles(styles)(Inset)
export const FlairedEdgesDivider = withStyles(styles)(FlairedEdges)
export const ContentDivider = withStyles(styles)(Content)
