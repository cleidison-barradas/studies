import React, { Component } from 'react'
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider, ThemeConsumer } from '../../context/ThemeContext'
import applicationTheme from '../../styles/theme/applicationTheme'
import { SnackbarProvider } from '../../context/SnackbarContext'

const styles = {
  root: {
    width: '100%',
    height: '100vh',
    marginTop: 0,
    zIndex: 1
  }
}

type ThemeWrapperProps = {
    classes: any
}

class ThemeWrapper extends Component<ThemeWrapperProps> {
  render () {
    const { classes, children } = this.props

    return (
            <ThemeProvider>
                <ThemeConsumer>
                    {({ color, mode }) => {
                      const theme = createMuiTheme(applicationTheme(color, mode, 'rtl'))
                      return (
                            <MuiThemeProvider theme={theme}>
                                <SnackbarProvider>
                                    <div className={classes.root}>{children}</div>
                                </SnackbarProvider>
                            </MuiThemeProvider>
                      )
                    }}
                </ThemeConsumer>
            </ThemeProvider>
    )
  }
}

export default withStyles(styles)(ThemeWrapper)
