import React, { Component } from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import Dashboard from '../Template/Dashboard'
import { ThemeConsumer } from '../../context/ThemeContext'

// Views
import routes, { AppRoute } from '../../navigation/index'
import Breadcrumbs from '../../components/Breadcrumbs'

export default class Application extends Component<RouteComponentProps> {
  render () {
    const { history } = this.props
    return (
            <ThemeConsumer>
                {({ mode, changeMode }) => {
                  return (
                        <Dashboard mode={mode} changeMode={changeMode} history={history} place="Home" bgPosition="half">
                            <Switch>
                                {routes
                                  .filter((route: AppRoute) => route.isPrivate)
                                  .map(({ component: RouteComponent, exact, path }: AppRoute) => (
                                        <Route
                                            key={path}
                                            render={(props: any) => {
                                              const crumbs = routes
                                                .filter(
                                                  ({ path: filterPath, isPrivate }) =>
                                                    props.match.path.includes(filterPath) && isPrivate
                                                )
                                              // Swap out any dynamic routes with their param values.
                                              // E.g. "/pizza/:pizzaId" will become "/pizza/1"
                                                .map(({ path: mapPath, ...rest }) => ({
                                                  path: Object.keys(props.match.params).length
                                                    ? Object.keys(props.match.params).reduce(
                                                      (paramPath, param) =>
                                                        mapPath.replace(
                                                                          `:${param}`,
                                                                          props.match.params[param]
                                                        ),
                                                      mapPath
                                                    )
                                                    : mapPath,
                                                  ...rest
                                                }))
                                              return (
                                                    <>
                                                        <Breadcrumbs crumbs={crumbs} />
                                                        <RouteComponent {...props} />
                                                    </>
                                              )
                                            }}
                                            exact={exact}
                                            path={path}
                                        />
                                  ))}
                            </Switch>
                        </Dashboard>
                  )
                }}
            </ThemeConsumer>
    )
  }
}
