import { Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik'
import React, { Component } from 'react'
import TextFormField from '../../TextFormField'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Billboard } from '../../../interfaces/billboard'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import styles from './styles'
import { withStyles } from '@material-ui/styles'
import { Box, Grid, MenuItem, TextField, Typography } from '@material-ui/core'
import SelectFormField from '../../SelectFormField'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { Autocomplete } from '@material-ui/lab'
import { StoreConsumer, StoreProvider } from '../../../context/StoreContext'
import { debounce } from 'lodash'
import draftToHtml from 'draftjs-to-html'
import SwitchFormField from '../../SwitchFormField'

interface Props {
    message: Billboard['message']
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class BillboardForm extends Component<Props> {
    state = {
        editorState: EditorState.createEmpty(),
        initialized: false,
    }

    componentDidMount() {
        const editorState = EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(this.props.message) as any)
        )
        this.setState({ editorState })
    }

    componentDidUpdate() {
        const { message } = this.props
        const { initialized } = this.state

        if (!initialized && message !== '') {
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(convertFromHTML(message) as any)
            )
            this.setState({ editorState, initialized: true })
        }
    }

    onEditorStateChange = (editorState: EditorState, setValue: (field: string, value: string) => void) => {
        this.setState({ ...this.state, editorState })
        const data = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        setValue('billboard.message', data)
    }

    render() {
        const { classes } = this.props
        const { editorState } = this.state
        return (
            <React.Fragment>
                <Field component={TextFormField} required name="billboard.title" label="Titulo" />
                <Box mt={3}>
                    <Field required component={SelectFormField} label="Tipo de aviso" name="billboard.type">
                        <MenuItem value="info"> informação </MenuItem>
                        <MenuItem value="warning"> aviso </MenuItem>
                        <MenuItem value="danger"> problema </MenuItem>
                    </Field>
                </Box>
                <Box mt={3}>
                    <Field
                        name="billboard.active"
                        component={SwitchFormField}
                        label="Aviso ativo?"
                        labelPlacement="start"
                    />
                </Box>
                <Box mt={3} mb={3}>
                    <Typography color="primary"> Descrição do aviso </Typography>
                    <Field name="billboard.message">
                        {({ form }: FieldProps) => (
                            <Editor
                                onEditorStateChange={(data) => this.onEditorStateChange(data, form.setFieldValue)}
                                editorState={editorState}
                                editorClassName={classes.editor}
                            />
                        )}
                    </Field>
                </Box>
                <Grid container spacing={3}>
                    <Grid item>
                        <Field name="billboard.startAt">
                            {({ field: { value }, form }: FieldProps) => (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        id="date-picker-dialog"
                                        label="Começa em"
                                        inputVariant="outlined"
                                        required
                                        format="dd/MM/yyyy"
                                        value={value}
                                        onChange={(data) => form.setFieldValue('billboard.startAt', data)}
                                    />
                                </MuiPickersUtilsProvider>
                            )}
                        </Field>
                    </Grid>
                    <Grid item>
                        <Field name="billboard.endAt">
                            {({ field: { value }, form }: FieldProps) => (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        id="date-picker-dialog"
                                        label="Termina em"
                                        inputVariant="outlined"
                                        format="dd/MM/yyyy"
                                        required
                                        value={value}
                                        onChange={(data) => form.setFieldValue('billboard.endAt', data)}
                                    />
                                </MuiPickersUtilsProvider>
                            )}
                        </Field>
                    </Grid>
                </Grid>
                <Box mt={3}>
                    <StoreProvider>
                        <StoreConsumer>
                            {({ getStores, stores }) => (
                                <FieldArray
                                    name="billboard.stores"
                                    render={({ form, remove }: FieldArrayRenderProps) => (
                                        <React.Fragment>
                                            <Autocomplete
                                                options={stores}
                                                multiple
                                                value={form.values.billboard.stores}
                                                defaultValue={form.values.billboard.stores}
                                                getOptionLabel={(store) => store.name}
                                                onChange={(ev: any, data) =>
                                                    data && form.setFieldValue('billboard.stores', data)
                                                }
                                                onInputChange={debounce(async (e, name) => {
                                                    await getStores({ name })
                                                }, 500)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Lojas"
                                                        helperText="Lojas que irão visualizar o aviso, caso não adicione nenhuma loja, todas as lojas poderão visualizar"
                                                        variant="outlined"
                                                    />
                                                )}
                                            />
                                        </React.Fragment>
                                    )}
                                />
                            )}
                        </StoreConsumer>
                    </StoreProvider>
                </Box>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(BillboardForm)
