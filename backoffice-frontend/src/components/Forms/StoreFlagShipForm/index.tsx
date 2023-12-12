import React, { Component } from "react"
import { FieldArray, FieldArrayRenderProps } from "formik"
import { Box, Chip, Grid, TextField, Typography, withStyles } from "@material-ui/core"
import { Autocomplete, AutocompleteRenderInputParams } from "@material-ui/lab"
import Store from "../../../interfaces/store"
import { GetStoresRequest } from "../../../services/api/interfaces/ApiRequest"
import styles from './styles'

interface Props {
  stores: Store[]
  store: Store | null
  filterStores: (data?: GetStoresRequest) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoreFlagShipForm extends Component<Props> {

  render() {
    const { stores, store, classes, filterStores } = this.props

    if (!store) {

      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Loja não encontrada!</Typography>
          </Grid>
        </Grid>
      )
    }
    return (
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FieldArray
              name="store.affiliateStores"
              render={({ push, form }: FieldArrayRenderProps) => (
                <Autocomplete
                  value={form.values.store?.affiliateStores || []}
                  options={stores.filter(_store => !_store.mainStore)}
                  renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Filiais"
                      placeholder="Procure uma filial"
                    />
                  )}
                  getOptionDisabled={(option: Store) =>
                    form.values.store?.affiliateStores?.find((_store: Store) => _store._id === option._id) ? true : false
                  }
                  getOptionLabel={op => op.name}
                  onChange={(ev: any, _store: Store | null) => {
                    if (_store) {
                      push(_store)
                    }
                  }}
                  className={classes.autocomplete}
                  onInputChange={async (e: React.ChangeEvent<{}>, value: any) => {
                    await filterStores({ name: String(value) })
                  }}
                />
              )}
            />

            <FieldArray
              name="store.affiliateStores"
              render={({ remove, form }: FieldArrayRenderProps) => (
                <Grid container>
                  {form.values.store?.affiliateStores &&
                    form.values.store?.affiliateStores.map((_store: Store, index: number) => (
                      <Grid key={_store._id} item xs={12} id={_store._id}>
                        <Chip label={_store.name} onDelete={() => remove(index)} style={{ marginTop: 10 }} />
                      </Grid>
                    ))}
                </Grid>
              )}
            />
          </Grid>

        </Grid>
      </Box>
    )
  }
}


export default withStyles(styles)(StoreFlagShipForm)