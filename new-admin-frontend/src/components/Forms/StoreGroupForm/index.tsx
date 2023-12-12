import React, { Component } from 'react'
import { Box, Chip, Grid, TextField, withStyles } from '@material-ui/core'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { Field, FieldArray, FieldArrayRenderProps } from 'formik'
import { RouteComponentProps } from 'react-router-dom'
import Store from '../../../interfaces/store'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props extends RouteComponentProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
  stores: Store[]
}

class StoreGroupForm extends Component<Props> {
  static defaultProps = {
    stores: [],
  }

  render() {
    const { classes, stores } = this.props
    return (
      <Grid container spacing={2}>
        <div className={classes.divcontainer}>
          <Field name="name" autoComplete="off" label="Nome do Grupo" component={TextFormField} className={classes.inputs} />

          <FieldArray
            name="stores"
            render={({ form, push }: FieldArrayRenderProps) => (
              <Autocomplete
                options={stores}
                className={classes.autocomplete}
                getOptionLabel={(option) => option.name}
                getOptionDisabled={(option: Store) =>
                  form.values.stores && form.values.stores.filter((store: Store) => store._id === option._id).length > 0
                    ? true
                    : false
                }
                onChange={(event: React.ChangeEvent<{}>, store: Store | null) => {
                  if (store) push(store)
                }}
                renderInput={(params: AutocompleteRenderInputParams) => (
                  <TextField {...params} variant="outlined" label="Farmácias do seu Subdomínio" />
                )}
              />
            )}
          />
          <FieldArray
            name="stores"
            render={({ form, remove }: FieldArrayRenderProps) => (
              <Grid container>
                {form.values.stores &&
                  form.values.stores.map((store: Store, index: number) => (
                    <Box ml={index !== 0 ? 1 : 0} mt={1} key={index}>
                      <Chip label={store.name} onDelete={() => remove(index)} />
                    </Box>
                  ))}
              </Grid>
            )}
          />
        </div>
      </Grid>
    )
  }
}

export default withStyles(styles)(StoreGroupForm)
