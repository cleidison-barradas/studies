import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import Auth from './Auth'
import Application from './Application'
import ThemeWrapper from './ThemeWrapper'
import { AuthConsumer, AuthProvider } from '../../context/AuthContext'

class App extends Component<RouteComponentProps> {
  render () {
    return (
            <ThemeWrapper>
                <AuthProvider>
                    <AuthConsumer>
                        {({ loggedIn }) => (
                            <Switch>
                                {loggedIn ? ( // && user
                                    <Route render={() => <Application {...this.props} />} />
                                ) : (
                                    <Route render={() => <Auth {...this.props} />} />
                                )}
                            </Switch>
                        )}
                    </AuthConsumer>
                </AuthProvider>
            </ThemeWrapper>
    )
  }
}

export default withRouter(App)
