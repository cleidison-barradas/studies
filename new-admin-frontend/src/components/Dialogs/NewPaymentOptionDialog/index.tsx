import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, withStyles } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import React, { Component } from 'react'
import PaymentOption from '../../../interfaces/paymentOption'
import SelectFormField from '../../SelectFormField'
import TextFormField from '../../TextFormField'
import styles from './styles'
import * as yup from 'yup'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    open: boolean
    onClose: () => void
    onSubmit: (data: PaymentOption) => Promise<void>
}

class NewPaymentOptionDialog extends Component<Props> {
    initialValues: PaymentOption = {
        name: '',
        type: '',
    }

    paymentTypes = [
        {
            type: 'credit',
            name: 'Crédito',
        },
        {
            type: 'debit',
            name: 'Débito',
        },
        {
            type: 'money',
            name: 'Dinheiro',
        },
    ]

    validateSchema = yup.object().shape({
        name: yup.string().required('Nome obrigatorio'),
        type: yup.string().required('Tipo obrigatorio'),
    })

    render() {
        const { open, onClose, onSubmit, classes } = this.props
        return (
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
                <DialogTitle>Adicionar nova forma de pagamento</DialogTitle>
                <Formik initialValues={this.initialValues} onSubmit={onSubmit}>
                    {() => (
                        <Form>
                            <DialogContent classes={{ root: classes.root }}>
                                <Box mb={2}>
                                    <Field name="name" label="Nome do metodo de pagamento" required component={TextFormField} />
                                </Box>
                                <Box mb={2}>
                                    <Field name="type" label="Tipo do pagamento" required component={SelectFormField}>
                                        {this.paymentTypes.map((value, index: number) => (
                                            <MenuItem value={value.type} key={index}>
                                                {value.name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={onClose}
                                    classes={{ contained: classes.redbtn }}
                                    variant="contained"
                                    color="primary"
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Cadastrar
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        )
    }
}

export default withStyles(styles)(NewPaymentOptionDialog)
