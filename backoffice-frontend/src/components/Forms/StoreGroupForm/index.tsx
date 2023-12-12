import { Box, Chip, Grid, TextField, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Field, FieldArray } from 'formik'
import React, { Component } from 'react'
import Store from '../../../interfaces/store'
import { GetStoresRequest } from '../../../services/api/interfaces/ApiRequest'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    getStores: (data?: GetStoresRequest) => Promise<void>
    stores: Store[]
}

class StoreGroupForm extends Component<Props> {
    render() {
        const { stores, getStores } = this.props
        return (
            <React.Fragment>
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12} xl={12}>
                        <Field name="name" component={TextFormField} label="Nome" />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12} xl={4}>
                        <FieldArray
                            name="stores"
                            render={({ push, remove, form: { values, errors, touched } }) => (
                                <React.Fragment>
                                    <Autocomplete
                                        options={stores}
                                        getOptionLabel={(store) => store.name}
                                        onChange={(_, store: Store | null) => (store ? push(store) : '')}
                                        getOptionDisabled={(option: Store) =>
                                            !!values.stores.find((value: Store) => value._id === option._id)
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Procure e adicione uma loja"
                                                onChange={(e) =>
                                                    getStores({
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        )}
                                    />
                                    <Box mt={3}>
                                        <Grid container spacing={3}>
                                            {values.stores.map((store: Store, index: number) => (
                                                <Grid item lg={4} md={12} sm={12} xs={12} xl={3} key={index}>
                                                    <Chip label={store.name} onDelete={() => remove(index)} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </React.Fragment>
                            )}
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(StoreGroupForm)
