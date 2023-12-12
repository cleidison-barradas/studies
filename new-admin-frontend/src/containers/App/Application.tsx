import { Switch } from 'react-router-dom'
import CustomComponent from '../../components/CustomComponent'
import { StartDocksModal } from '../../components/StartDocksModal'

import CustomRouter from '../../components/CustomRouter'
import { FinancialProvider } from '../../context/FinancialContext'
import { NotificationProvider } from '../../context/NotificationContext'
import { RouteLinkConsumer, RouteLinkProvider } from '../../context/RouteLinkContext'
import { StartDocksConsumer, StartDocksProvider } from '../../context/StartDocksContext'

import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import routes, { AppRoute } from '../../navigation/index'
import Dashboard from '../Template/Dashboard'

export default class Application extends CustomComponent<{}> {
  render() {
    return (
      <RouteLinkProvider>
        <NotificationProvider>
          <FinancialProvider>
            <StoreProvider>
              <StartDocksProvider>
                <StartDocksConsumer>{(startDocks) => <StartDocksModal {...startDocks} />}</StartDocksConsumer>
                <RouteLinkConsumer>
                  {({ links, requestGetRouteLinks }) => (
                    <StoreConsumer>
                      {({ store, requestgetStore }) => (
                        <>
                          <Dashboard links={links} store={store} loadStore={requestgetStore} loadLinks={requestGetRouteLinks}>
                            <Switch>
                              {links.length > 0 &&
                                store &&
                                routes
                                  .filter((route: AppRoute) => route.isPrivate || route.path === '/tenant')
                                  .map((route, index) => <CustomRouter store={store} key={index} {...route} />)}
                            </Switch>
                          </Dashboard>
                        </>
                      )}
                    </StoreConsumer>
                  )}
                </RouteLinkConsumer>
              </StartDocksProvider>
            </StoreProvider>
          </FinancialProvider>
        </NotificationProvider>
      </RouteLinkProvider>
    )
  }
}
