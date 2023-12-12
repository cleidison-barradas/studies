import React from 'react'
import { withStyles } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import { ThemeConsumer } from '../../context/ThemeContext'
import DeliverySchedule from '../../components/Forms/DeliverySchedule'
import { StoreDeliveryProvider, StoreDeliveryConsumer } from '../../context/DeliveryStore'
import { DeliveryScheduleConsumer, DeliveryScheduleProvider, ScheduleType } from '../../context/DeliverySchedule'
import DeliveryPoliticsPaper from '../../components/Papers/DeliveryPoliticsPaper'
import ShippingConfigPaper from '../../components/Papers/ShippingConfigPaper'
import { StoreProvider, StoreConsumer } from '../../context/StoreContext'

import customerxService from '../../services/customerx.service'
import Plan from '../../interfaces/plan'
import { SnackbarConsumer } from '../../context/SnackbarContext'
import BestShippingPaper from '../../components/Papers/BestShippingPaper'
import style from './style'
import { ApiShippingConsumer, ApiShippingProvider } from '../../context/ApiShipping'
import CustomComponent from '../../components/CustomComponent'

interface AuthorizatrionBestShipping {
  code?: string
}

interface Props extends RouteComponentProps<AuthorizatrionBestShipping> {
  plan?: Plan
  classes: any
}

interface State {
  code: string
}

class DeliveryConfig extends CustomComponent<Props, State> {
  state: State = {
    code: '',
  }
  /**
   * Delete Payments
   *
   * @param {any} data
   * @param {Function} dispatch
   */
  handleDeletePayment = (data: any, dispatch: (value: any) => void) => {
    const values = { payments: data }
    dispatch(values)
  }

  /**
   * Save Schedule
   *
   * @param data
   * @param dispatch
   */
  handleScheduleSave = async (data: any, dispatch: (values: any) => Promise<ScheduleType | null>) => {
    await dispatch(data)
  }

  /**
   * Delete Schedule
   *
   * @param data
   */
  handleScheduleDelete = (data: any, dispatch: (values: any) => void) => {
    dispatch(data)
  }

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes, plan } = this.props
    const { code } = this.state

    return (
      <ThemeConsumer>
        {({ mode, changeMode }) => (
          <SnackbarConsumer>
            {({ openSnackbar }) => (
              <React.Fragment>
                <DeliveryScheduleProvider>
                  <DeliveryScheduleConsumer>
                    {({ fetching, error, deletedId, requestAddSchedule, requestDeleteSchedule, requestGetSchedule }) => {
                      return (
                        <DeliverySchedule
                          classes={classes}
                          mode={mode}
                          error={error}
                          averageTime={plan?.rule === 'institutional'}
                          fetching={fetching}
                          deletedId={deletedId}
                          loadSchedule={requestGetSchedule}
                          onSave={(value: any) => this.handleScheduleSave(value, requestAddSchedule)}
                          onDelete={(value: any) => this.handleScheduleDelete(value, requestDeleteSchedule)}
                          titleName={plan && plan.rule.includes('start') ? 'Horário de funcionamento' : 'Programação de entrega'}
                        />
                      )
                    }}
                  </DeliveryScheduleConsumer>
                </DeliveryScheduleProvider>
                {this.canSeeComponent(['pro', 'pro-generic', 'enterprise', 'start'], plan) && (
                <StoreProvider>
                  <StoreConsumer>
                    {({ store, fetching, success, module, requestaddSettings, requestgetStore, requestGetIntegrationModule }) => (
                      <StoreDeliveryProvider>
                        <StoreDeliveryConsumer>
                          {({
                            states,
                            cities,
                            success,
                            fetching,
                            pagination,
                            deliveryFees,
                            distanceDeliveryFees,
                            neighborhoods,
                            requestGetStoreDeliveries,
                            requestGetStoreDistanceDeliveries,
                            requestGetStateDeliveries,
                            requestGetCitiesDeliveries,
                            requestSaveStoreDeliveries,
                            requestSaveStoreDistanceDeliveries,
                            requestDeleteStoreDeliveries,
                            requestDeleteStoreDistanceDeliveries,
                            requestAddNeighborhoodDeliveries,
                            requestGetNeighborhoodsDeliveries,
                          }) => {
                            return (
                              <DeliveryPoliticsPaper
                                mode={mode}
                                store={store}
                                plan={plan}
                                states={states}
                                cities={cities}
                                fetching={fetching}
                                onSuccess={success}
                                pagination={pagination}
                                deliveries={deliveryFees}
                                distanceDeliveries={distanceDeliveryFees}
                                neighborhoods={neighborhoods}
                                openSnackbar={openSnackbar}
                                onSave={requestSaveStoreDeliveries}
                                distanceOnSave={requestSaveStoreDistanceDeliveries}
                                getCities={requestGetCitiesDeliveries}
                                loadStates={requestGetStateDeliveries}
                                onDelete={requestDeleteStoreDeliveries}
                                onDeleteDistanceDeliveries={requestDeleteStoreDistanceDeliveries}
                                loadDeliveries={requestGetStoreDeliveries}
                                loadDistanceDeliveries={requestGetStoreDistanceDeliveries}
                                addNeighborhood={requestAddNeighborhoodDeliveries}
                                getNeighborhoods={requestGetNeighborhoodsDeliveries}
                                requestaddSettings={requestaddSettings}
                              />
                            )
                          }}
                        </StoreDeliveryConsumer>
                      </StoreDeliveryProvider>
                    )}
                  </StoreConsumer>
                  <ApiShippingProvider>
                    <ApiShippingConsumer>
                      {({ requesGetAccessToken }) => (
                        <StoreConsumer>
                          {({ store, fetching, success, module, requestaddSettings, requestgetStore, requestGetIntegrationModule }) => (
                            <React.Fragment>
                              <ShippingConfigPaper
                                plan={plan}
                                store={store}
                                success={success}
                                fetching={fetching}
                                snackbar={openSnackbar}
                                onSave={requestaddSettings}
                                loadStoreSettings={requestgetStore}
                                disabled={store?.settings.config_best_shipping}
                              />
                              <BestShippingPaper
                                {...this.props}
                                code={code}
                                plan={plan}
                                store={store}
                                module={module}
                                onSave={requestaddSettings}
                                loadStoreSettings={requestgetStore}
                                getAccessToken={requesGetAccessToken}
                                loadModule={requestGetIntegrationModule}
                                disabled={store?.settings.config_shipping_courier}
                              />
                            </React.Fragment>
                          )}
                        </StoreConsumer>
                      )}
                    </ApiShippingConsumer>
                  </ApiShippingProvider>
                </StoreProvider>
                )}
              </React.Fragment>
            )}
          </SnackbarConsumer>
        )}
      </ThemeConsumer>
    )
  }
}
export default withStyles(style)(DeliveryConfig)