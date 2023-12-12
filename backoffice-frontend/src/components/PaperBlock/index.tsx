import React, { Component } from 'react'
import classNames from 'classnames'
import { Paper, Theme, Typography, withTheme } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import { resolveValue } from 'path-value'

type Cons<H, T> = T extends readonly any[]
    ? ((h: H, ...t: T) => void) extends (...r: infer R) => void
        ? R
        : never
    : never

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

type Leaves<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? { [K in keyof T]-?: Cons<K, Leaves<T[K], Prev[D]>> }[keyof T]
    : []

type PaperBlockProps = {
    classes: Record<keyof ReturnType<typeof styles>, string>
    title?: string
    borderColor?: Leaves<Theme['palette']>
    backgroundColor?: Leaves<Theme['palette']>
    textColor?: Leaves<Theme['palette']>
    titleCentered?: boolean
    theme: Theme
}

class PaperBlock extends Component<PaperBlockProps> {
    static defaultProps = {
      titleCentered: false
    }

    render () {
      const {
        classes,
        children,
        title,
        theme,
        backgroundColor = theme.palette.type === 'light' ? ['white', 'light'] : ['white', 'dark'],
        borderColor,
        textColor = theme.palette.type === 'dark' ? ['black', 'primary', 'dark'] : ['primary', 'main'],
        titleCentered
      } = this.props
      return (
            <Paper
                className={classes.container}
                style={{ backgroundColor: resolveValue(theme.palette, backgroundColor.join('.')) }}
                elevation={1}
            >
                {title
                  ? (
                    <div
                        className={classes.header}
                        style={borderColor && { borderColor: resolveValue(theme.palette, borderColor.join('.')) }}
                    >
                        <Typography
                            className={classNames(classes.title, titleCentered && classes.titleCenter)}
                            style={textColor && { color: resolveValue(theme.palette, textColor.join('.')) }}
                        >
                            {title}
                        </Typography>
                    </div>
                    )
                  : undefined}
                {children}
            </Paper>
      )
    }
}

export default withTheme(withStyles(styles)(PaperBlock))
