import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import Auth from './Auth'
import Application from './Application'
import ThemeWrapper from './ThemeWrapper'
import { AuthConsumer, AuthProvider } from '../../context/AuthContext'
import { SnackbarProvider } from '../../context/SnackbarContext'
import RefreshSessionBackdrop from '../../components/RefreshSessionBackdrop'

class App extends Component<RouteComponentProps> {
  render() {
    const { history } = this.props
    return (
      <ThemeWrapper>
        <SnackbarProvider>
          <AuthProvider history={history}>
            <AuthConsumer>
              {({ loggedIn, user }) => (
                <React.Fragment>
                  <RefreshSessionBackdrop />
                  <Switch>
                    <Route component={loggedIn && user ? Application : Auth} />
                  </Switch>
                </React.Fragment>
              )}
            </AuthConsumer>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeWrapper>
    )
  }
}

export default withRouter(App)
