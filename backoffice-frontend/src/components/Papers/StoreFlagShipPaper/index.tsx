import React, { Component } from "react"
import { Field, Form, Formik } from "formik"
import { Button, CircularProgress, Grid, withStyles } from "@material-ui/core"

import StoreFlagShipTable from "../../Tables/StoreFlagShipTable"
import TextFormField from "../../TextFormField"
import PaperBlock from "../../PaperBlock"

import { GetStoresRequest } from "../../../services/api/interfaces/ApiRequest"

import Pagination from "../../../interfaces/pagination"
import Store from "../../../interfaces/store"

import styles from "./styles"

interface Props {
  stores: Store[]
  pagination?: Pagination
  getStores: (data?: GetStoresRequest) => Promise<void>
}

class StoreFlagShipPaper extends Component<Props> {
  static defaultProps = {
    stores: []
  }


  initalValues: GetStoresRequest = {
    page: 1,
    limit: 20,
    mainStore: true
  }

  async componentDidMount() {
    await this.onLoad(this.initalValues)
  }

  onLoad = async (data?: GetStoresRequest) => {
    const { getStores } = this.props

    await getStores(data)
  }

  render() {
    const { stores, pagination, getStores } = this.props

    return (
      <PaperBlock title="Matrizes">
        <Formik initialValues={this.initalValues} enableReinitialize onSubmit={getStores}>
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Field name="name" type="search" label="pesquisar pelo nome da matriz" autoComplete="off" component={TextFormField} />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={22} color="secondary" /> : 'Procurar'}
                  </Button>
                </Grid>
              </Grid>
              <StoreFlagShipTable stores={stores} pagination={pagination} />
            </Form>
          )}
        </Formik>
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(StoreFlagShipPaper)