import React from 'react'
import { Route } from 'react-router-dom'
import AreaNotAllowed from '../AreaNotAllowed'


export default function RouteWrapper({ component: Component, ...rest }: any) {

  const { store, path } = rest

  if (store) {
    if (store.plan) {
      const { plan } = store
      if (plan.permissions.paths.includes(path)) {

        return <Route {...rest} render={(props) => <Component plan={store.plan} {...props} />} />
      }
    }
    return <Route {...rest} render={(props) => <AreaNotAllowed plan={store.plan} {...props} />} />
  }
  return <Route {...rest} render={(props) => <AreaNotAllowed plan={undefined} {...props} />} />
}