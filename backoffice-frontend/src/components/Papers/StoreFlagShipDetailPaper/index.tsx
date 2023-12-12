import React, { Component } from "react"
import { Button, CircularProgress, Grid, withStyles } from "@material-ui/core"
import { Form, Formik } from "formik"
import Store from "../../../interfaces/store"

import PaperBlock from "../../PaperBlock"
import StoreFlagShipForm from "../../Forms/StoreFlagShipForm"
import {
  GetStoresRequest,
  PutStoreRequest
}
  from "../../../services/api/interfaces/ApiRequest"

import styles from './styles'

interface Props {
  storeId: string
  stores: Store[]
  store: Store | null
  onUpdate: (storeId: string, data: PutStoreRequest) => void
  loadStores: (data?: GetStoresRequest) => Promise<void>
  getStore: (storeId?: string) => Promise<void>
}

class StoreFlagShipDetailPaper extends Component<Props> {

  async componentDidMount() {
    const { storeId, loadStores } = this.props

    await Promise.all([this.onLoad(storeId), loadStores()])
  }

  onLoad = async (storeId?: string) => {

    await this.props.getStore(storeId)
  }

  handleSubmit = async (data: any) => {
    this.props.onUpdate(this.props.storeId, data)

    await this.onLoad(this.props.storeId)
  }

  render() {
    const { store, stores, loadStores } = this.props

    return (
      <PaperBlock title={`Informações da Matriz ${store ? '- ' + store.name : ''}`}>
        <Formik
          enableReinitialize
          onSubmit={this.handleSubmit}
          initialValues={{
            store: store || null
          }}>
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={3} >
                <Grid item xs={12}>
                  <StoreFlagShipForm
                    store={store}
                    stores={stores}
                    filterStores={loadStores}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(StoreFlagShipDetailPaper)