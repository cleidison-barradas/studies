import { Chip, Grid, MenuItem, TextField, withStyles } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { Field, FieldArray } from 'formik'
import { debounce } from 'lodash'
import React, { Component } from 'react'
import { StoreConsumer } from '../../../context/StoreContext'
import Store from '../../../interfaces/store'
import { PutUserRequest } from '../../../services/api/interfaces/ApiRequest'
import PaperBlock from '../../PaperBlock'
import SelectFormField from '../../SelectFormField'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    stores?: Store[]
    values: PutUserRequest
}

class NewUserForm extends Component<Props> {
    render() {
        const { stores, values } = this.props
        return (
            <StoreConsumer>
                {({ getStores }) => (
                    <React.Fragment>
                        <PaperBlock title="Dados cadastrais">
                            <Grid container spacing={3}>
                                <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                                    <Field name="userName" label="Usúario" component={TextFormField} />
                                </Grid>
                                <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                                    <Field name="password" label="Senha" type="password" component={TextFormField} />
                                </Grid>
                                <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                                    <Field name="email" label="Email" component={TextFormField} />
                                </Grid>
                                <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                                    <Field name="role" label="Função" component={SelectFormField}>
                                        <MenuItem value="store">Loja</MenuItem>
                                        <MenuItem value="admin">Administrador</MenuItem>
                                        <MenuItem value="support">Suporte</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                                    <Field name="status" label="Status" component={SelectFormField}>
                                        <MenuItem value="active">Ativo</MenuItem>
                                        <MenuItem value="disabled">Desativado</MenuItem>
                                    </Field>
                                </Grid>
                                <Grid item lg={12} md={12} xs={12} sm={12} xl={12}>
                                    <FieldArray
                                        name="store"
                                        render={({ push, remove }) => (
                                            <React.Fragment>
                                                <Autocomplete
                                                    options={stores!}
                                                    getOptionLabel={(store: Store) => store.name}
                                                    onChange={(ev: any, store: Store | null) => {
                                                        if (
                                                            store &&
                                                            values.store.filter((e) => e._id === store._id)
                                                                .length === 0
                                                        ) {
                                                            push(store)
                                                        }
                                                    }}
                                                    onInputChange={debounce(async (_, name) => {
                                                        await getStores({ name })
                                                    }, 500)}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Procure e adicione lojas"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                                <Grid container>
                                                    {values.store.map((store: Store, index: number) => (
                                                        <Chip
                                                            key={index}
                                                            label={store.name}
                                                            onDelete={() => remove(index)}
                                                        />
                                                    ))}
                                                </Grid>
                                            </React.Fragment>
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </PaperBlock>
                    </React.Fragment>
                )}
            </StoreConsumer>
        )
    }
}

export default withStyles(styles)(NewUserForm)
