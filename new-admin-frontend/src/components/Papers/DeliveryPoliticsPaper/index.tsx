import React from 'react'
import * as yup from 'yup'
import { Field, FieldProps, Form, Formik } from 'formik'
import { Box, Button, Grid, IconButton, Input, InputAdornment, Typography, withStyles, Switch } from '@material-ui/core'

import NewStoreDeliveriesForm from '../../Forms/AddStoreDeliveryForm'
import NewStoreDistanceDeliveriesForm from '../../Forms/AddStoreDistanceDeliveryForm'
import DeliveryStorePoliticsTable from '../../Tables/DeliveryStorePolitcsTable'
import DistanceDeliveryStorePoliticsTable from '../../Tables/DistanceDeliveryStorePolitcsTable'
// Interfaces
import PaperBlock from '../../PaperBlock'
import City from '../../../interfaces/city'
import States from '../../../interfaces/state'
import Pagination from '../../../interfaces/pagination'
import DeliveryFee from '../../../interfaces/deliveryFee'
import DistanceDeliveryFeeInterface from '../../../interfaces/distanceDeliveryFee'
import {Neighborhood} from '../../../interfaces/neighborhood'
import styles from './styles'
import Plan from '../../../interfaces/plan'
import CustomComponent from '../../CustomComponent'
import AreaNotAllowed from '../../AreaNotAllowed'
import MapComponent from '../../DeliveryAreaMap'
import Store from '../../../interfaces/store'
import DistanceDeliveryFee from '../../../interfaces/distanceDeliveryFee'

import SearchIcon from '../../../assets/images/greySearchIcon.svg'
import { debounce } from 'lodash'
import { ThemeConsumer } from '../../../context/ThemeContext'
import CustomAddressDialog from '../../CustomAddressDialog'


interface Props {
  mode: any
  store: Store | null
  plan?: Plan
  states: States[]
  cities: City[]
  fetching: boolean
  onSuccess: boolean
  pagination: Pagination
  deliveries: DeliveryFee[]
  distanceDeliveries: DistanceDeliveryFeeInterface[]
  neighborhoods: Neighborhood[]
  onSave: (data: any) => void
  distanceOnSave: (data: any) => void
  onDelete: (ids: string[]) => void
  onDeleteDistanceDeliveries: (ids: string[]) => void
  loadStates: (id?: string) => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  getCities: (id: City['_id'] | null) => void
  addNeighborhood: (data: any) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
  getNeighborhoods: (id: Neighborhood['_id'] | null) => void
  loadDeliveries: (id?: string, page?: number, limit?: number, query?: string) => void
  loadDistanceDeliveries: () => void
  requestaddSettings: (store: Store) => Promise<void>

}

interface State {
  deliveries: DeliveryFee[]
  distanceDeliveries: DistanceDeliveryFee[]
  delivery_rule: string
  newDistanceDeliveryFee: DistanceDeliveryFee | null
  addressDialogIsOpen: boolean
}

class DeliveryPoliticsPaper extends CustomComponent<Props, State> {
  static defaultProps = {
    store: null,
    states: [],
    cities: [],
    deliveries: [],
    fetching: false,
    onSuccess: false,
    neighborhoods: [],
    pagination: {
      pages: 0,
      limit: 20,
      total: 0,
      currentPage: 1,
    },
  }

  state: State = {
    deliveries: [],
    distanceDeliveries: [],
    delivery_rule: 'neighborhood',
    addressDialogIsOpen: false,
    newDistanceDeliveryFee: {
      _id: '0',
      deliveryTime: 0,
      feePrice: 0,
      freeFrom: 0,
      minimumPurchase: 0,
      distance: 0
    }
  }

  onLoad = (id?: string, page?: number, limit?: number) => {
    const { loadDeliveries, loadStates, loadDistanceDeliveries } = this.props

    loadDeliveries(id, page, limit)
    loadDistanceDeliveries()
    loadStates()
  }

  componentDidMount() {
    setTimeout(() => {
    const { store } = this.props
    if (store?.settings.config_local_delivery_rule && store?.settings.config_local_delivery_rule.length > 0) {
      this.setState((state: any) => ({
        ...state,
        delivery_rule: store.settings.config_local_delivery_rule
      }))
    }
    this.onLoad()
    }, 1000)
  }


  componentDidUpdate(prevProps: any) {
    if (this.props.deliveries !== prevProps.deliveries) {
      this.setState((state: any) => ({
        ...state,
        deliveries: this.props.deliveries,
      }))
    }
    if (this.props.distanceDeliveries !== prevProps.distanceDeliveries) {
      this.setState((state: any) => ({
        ...state,
        distanceDeliveries: this.props.distanceDeliveries,
      }))
    }
  }

  handleSave = (data: any) => {
    const { onSave, onSuccess, openSnackbar } = this.props

    onSave(data)

    if (onSuccess) {
      openSnackbar('Registro salvo com sucesso !')

      setTimeout(() => {
        this.onLoad()
      }, 1500)
    } else {
      openSnackbar('Ocorreu um erro, tente novamente !')
    }
  }

  handleSaveDistanceFees = (data: any) => {
    const { distanceOnSave, onSuccess, openSnackbar } = this.props
      distanceOnSave(data)
    if (onSuccess) {
      openSnackbar('Registro salvo com sucesso !')

      setTimeout(() => {
        this.onLoad()
      }, 1500)
    } else {
      openSnackbar('Ocorreu um erro, tente novamente !')
    }
  }

  handleDelete = (ids: string[]) => {
    const { onDelete } = this.props
    onDelete(ids)

    setTimeout(() => {
      this.onLoad()
    }, 1500)
  }

  handleDeleteDistaceFees = (ids: string[]) => {
    const { onDeleteDistanceDeliveries } = this.props
    onDeleteDistanceDeliveries(ids)

    setTimeout(() => {
      this.onLoad()
    }, 1500)
  }

  validationSchema = yup.object().shape({
    feePrice: yup.number().default(0),
    freeFrom: yup.number().default(0),
    minimumPurchase: yup.number().default(0),
    deliveryTime: yup
      .number()
      .nullable(true)
      .when('state', (state: yup.AnySchema, field: yup.AnySchema) => (state ? field.required() : field)),
    deliveries: yup.array(),
    state: yup.object().nullable(true),
    neighborhoods: yup
      .array()
      .when('state', (state: yup.AnySchema, field: yup.AnySchema) =>
        state ? field.required().min(1, 'selecione no mínimo 1 bairro') : field
      ),
    city: yup
      .object()
      .nullable(true)
      .when('state', (state: yup.AnySchema, field: yup.AnySchema) => (state ? field.required('Cidade obrigatória') : field)),
  })

  handleAddNeighborhood = (data: any, cityId: string) => {
    const { addNeighborhood, getNeighborhoods, openSnackbar, onSuccess } = this.props
    addNeighborhood(data)

    if (onSuccess) {
      openSnackbar('Bairro salvo com sucesso !')

      setTimeout(() => {
        getNeighborhoods(cityId)
      }, 1500)
    } else {
      openSnackbar('Ocorreu um erro, tente novamente !')
    }

    setTimeout(() => {
      this.onLoad()
    }, 1000)
  }

  handleEditDeliveries = (data: any, id: string) => {
    const { deliveries } = this.state

    const index = deliveries.findIndex((x) => x._id === id)

    if (index !== -1) {
      deliveries[index] = data
    }

    this.setState((state: any) => ({
      ...state,
      deliveries,
    }))
  }

  handleEditDistanceDeliveries = (data: any, id: string) => {
    const { distanceDeliveries } = this.state

    const index = distanceDeliveries.findIndex((x) => x._id === id)

    if (index !== -1) {
      distanceDeliveries[index] = data
    }

    this.setState((state: any) => ({
      ...state,
      distanceDeliveries,
    }))

  }

  handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ delivery_rule: event.target.value as string })
  }

  handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { store } = this.props


    if (store) {
      const hasCoordinates =
        store.settings.config_address_latitude !== undefined &&
        store.settings.config_address_longitude !== undefined &&
        (store.settings.config_address_latitude !== 0 ||
          store.settings.config_address_longitude !== 0)

      if (hasCoordinates) {
        const newDeliveryRule =
          this.state.delivery_rule === 'distance' ? 'neighborhood' : 'distance'
        this.setState({ delivery_rule: newDeliveryRule })
      } else {
        this.setState((prevState) => ({
          ...prevState,
          addressDialogIsOpen: !prevState.addressDialogIsOpen,
        }))
      }
    }
  }

  handleNewDistanceFeeFieldChange = (fieldName: string, value: any) => {
    this.setState((state: any) => ({
      ...state,
      newDistanceDeliveryFee: {
        ...state.newDistanceDeliveryFee,
        [fieldName]: value,
      },
    }))
  }

  handleChangeQuery = debounce((query: string) => {
    this.props.loadDeliveries(undefined, 0, 10, query)
  }, 300)

  handeCloseAddressDialog = () => {
    this.setState((state: any) => ({
      ...state,
      addressDialogIsOpen: !this.state.addressDialogIsOpen
    }))
  }

  render() {
    const { classes, store, states, cities, neighborhoods, fetching, pagination, plan, getCities, getNeighborhoods, requestaddSettings } = this.props
    const { deliveries, distanceDeliveries, delivery_rule, newDistanceDeliveryFee, addressDialogIsOpen } = this.state
    let storeHasCoordinates = false
    if (
      (store?.settings.config_address_latitude !== undefined && store?.settings.config_address_longitude !== undefined) &&
      (store?.settings.config_address_latitude !== 0 || store?.settings.config_address_longitude !== 0)
    ) {
      storeHasCoordinates = true
    }

    return (
      <div>
        <PaperBlock title={'Políticas de Entrega (Delivery Local)'}>
          {this.canSeeComponent(['pro', 'enterprise', 'pro-generic'], plan) ? (
            <>
            <CustomAddressDialog
              isOpen={addressDialogIsOpen}
              onClose={this.handeCloseAddressDialog}
              requestaddSettings={requestaddSettings}
              store={store}
            />
              <Box mt={2} mb={2}>
              <Grid container spacing={2} alignItems="flex-start" direction="column">
                  <Grid item style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography component="label" style={{marginRight: '60px'}}>Método de cadastro:</Typography>
                    <div className={classes.switchTextBox} style={{
                      borderTopLeftRadius: '20px',
                      borderBottomLeftRadius: '20px',
                      backgroundColor: this.state.delivery_rule === 'neighborhood' ? '#d6edff' : 'transparent'}}>
                      <Typography>Bairros</Typography>
                    </div>
                    <div className={classes.switchBox} style={
                      {borderRadius: this.state.delivery_rule === 'distance' ? '50px 0px 0px 50px' : '0px 50px 50px 0px'}}>
                    <Switch
                      name="delivery_rule_toggle"
                      checked={this.state.delivery_rule === 'distance'}
                      onChange={this.handleSwitchChange}
                      classes={{
                        switchBase: classes.switchBase,
                        checked: classes.checked,
                        track: classes.track,
                        thumb: classes.thumb,
                      }}
                    />
                    </div>
                    <div className={classes.switchTextBox} style={{
                      borderTopRightRadius: '20px',
                      borderBottomRightRadius: '20px',
                      backgroundColor: this.state.delivery_rule === 'distance' ? '#d6edff' : 'transparent'}}>
                    <Typography>Distância</Typography>
                    </div>
                  </Grid>
              </Grid>
              </Box>
              {
                delivery_rule === 'neighborhood' ? (
                  <Formik
                    initialValues={{
                      state: null,
                      city: null,
                      feePrice: 0,
                      freeFrom: 0,
                      deliveryTime: null,
                      minimumPurchase: 0,
                      deliveries,
                      neighborhoods: [],
                    }}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSave}
                    enableReinitialize
                  >
                    {({ isValid, errors }) => (
                      <Form>
                        <Grid item xl={5} lg={5} md={3} sm={3} xs={12}>
                          <Input
                            fullWidth
                            name="query"
                            autoComplete="off"
                            placeholder="Busque cidades ou bairros já cadastrados"
                            startAdornment={
                              <InputAdornment position="start">
                                <IconButton>
                                  <img src={SearchIcon} alt="search-product" />
                                </IconButton>
                              </InputAdornment>
                            }
                            onChange={({ target }) => this.handleChangeQuery(target.value)}
                          />
                        </Grid>
                        <DeliveryStorePoliticsTable
                          fetching={fetching}
                          deliveries={deliveries}
                          pagination={pagination}
                          handleDelete={this.handleDelete}
                          onEdit={this.handleEditDeliveries}
                          paginateDeliveries={this.onLoad}
                        />
                        <div className={classes.divider}>
                          <Typography>Cadastrar nova</Typography>
                          <hr className={classes.line} />
                        </div>
                        <NewStoreDeliveriesForm
                          deliveries={deliveries}
                          states={states}
                          cities={cities}
                          errors={errors}
                          fetching={fetching}
                          neighborhoods={neighborhoods}
                          getCities={getCities}
                          getNeighborhods={getNeighborhoods}
                          onAddNeighborhood={this.handleAddNeighborhood}
                        />
                        <Box mt={2}>
                          <Grid container spacing={2}>
                            <Grid item>
                              <Button
                                type="submit"
                                classes={{ root: classes.buttonsave }}
                                disabled={!isValid}
                                variant="contained"
                                color="primary"
                              >
                                Salvar
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div>
                  {storeHasCoordinates &&
                  <Formik
                    initialValues={{
                      distance: 0,
                      feePrice: 0,
                      deliveryTime: 0,
                      minimumPurchase: 0,
                      distanceDeliveries,
                    }}
                    validationSchema={yup.object().shape({
                      distance: yup.number().required('Distance is required'),
                      feePrice: yup.number().required('Fee Price is required'),
                      deliveryTime: yup.number().required('Delivery Time is required'),
                      minimumPurchase: yup.number().required('Minimum Purchase is required'),
                    })}
                    onSubmit={this.handleSaveDistanceFees}
                    enableReinitialize
                  >
                    {({ errors, touched, isValid }) => (
                      <Form>
                        <Box mt={2}>
                          <Grid container spacing={1}>
                            <Grid item xs={10} style={{ alignSelf: 'flex-end' }}>
                              <Field>
                                {() => (
                                  <NewStoreDistanceDeliveriesForm
                                    distanceDeliveries={[]}
                                    touched={touched}
                                    errors={errors}
                                    newDistanceDeliveryFee={newDistanceDeliveryFee}
                                    handleNewDistanceFeeFieldChange={this.handleNewDistanceFeeFieldChange} />
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                type="submit"
                                classes={{ root: classes.buttonsave }}
                                disabled={!isValid}
                                variant="contained"
                                color="primary"
                              >
                                Cadastrar e Salvar
                              </Button>
                            </Grid>
                            <Grid item xs={12}>
                              <hr className={classes.insideLine} />
                            </Grid>
                            <Grid item xs={12}>
                              <ThemeConsumer>
                                {({ mode }) => (
                                  <MapComponent
                                    centerLatitude={store?.settings.config_address_latitude}
                                    centerLongitude={store?.settings.config_address_longitude}
                                    deliveryAreas={distanceDeliveries}
                                    theme={mode}
                                    newDistanceDeliveryFee={newDistanceDeliveryFee}
                                  />
                                )}
                              </ThemeConsumer>
                              </Grid>
                          </Grid>
                        </Box>

                        <div className={classes.divider}>
                          <hr className={classes.insideLine} />
                        </div>
                        <Typography className={classes.caption}>Já cadastradas</Typography>
                        <Field>
                        {({ form }: FieldProps) => (
                          <DistanceDeliveryStorePoliticsTable
                            fetching={fetching}
                            distanceDeliveries={distanceDeliveries}
                            handleDelete={this.handleDeleteDistaceFees}
                            onEdit={this.handleEditDistanceDeliveries}
                            setFieldValue={() => form.setFieldValue('distanceDeliveries', distanceDeliveries)}
                           />
                                )}
                        </Field>
                        <Box mt={2}>
                          <Grid container spacing={2}>
                            <Grid item>
                              <Button
                                type="submit"
                                classes={{ root: classes.buttonsave }}
                                variant="contained"
                                color="primary"
                              >
                                Salvar
                              </Button>
                            </Grid>
                          </Grid>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                  }
                  </div>
                )
              }
            </>
          ) : (
            <AreaNotAllowed />
          )}
        </PaperBlock>

      </div>
    )
  }
}

export default withStyles(styles)(DeliveryPoliticsPaper)
