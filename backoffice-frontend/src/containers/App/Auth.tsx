import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { Outer } from '../Template'
import NavRoutes, { AppRoute } from '../../navigation'

export default class Auth extends Component {
    render() {
        return (
            <Outer gradient={false} decoration={false}>
                <Switch>
                    {NavRoutes.filter((p: AppRoute) => !p.isPrivate).map((route, index) => {
                        const { path, exact, component } = route
                        return <Route key={`route-${index}`} path={path} exact={exact} component={component} />
                    })}
                </Switch>
            </Outer>
        )
    }
}
