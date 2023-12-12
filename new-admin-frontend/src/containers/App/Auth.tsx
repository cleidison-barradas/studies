import React, { Component } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import NavRoutes from '../../navigation'

export default class Auth extends Component<RouteComponentProps> {
  render() {
    return (
      <Switch>
        {NavRoutes.filter((p) => !p.isPrivate).map((route, index) => {
          return <Route {...route} key={index} />
        })}
      </Switch>
    )
  }
}
