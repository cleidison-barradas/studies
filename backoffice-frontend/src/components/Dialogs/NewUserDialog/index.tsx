import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    withStyles,
} from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import { PlanConsumer, PlanProvider } from '../../../context/PlanContext'
import { StoreConsumer, StoreProvider } from '../../../context/StoreContext'
import { PutUserRequest } from '../../../services/api/interfaces/ApiRequest'
import NewUserForm from '../../Forms/NewUserForm'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    open: boolean
    handleClose: (...args: any) => void
    handleSubmit: (PutUserRequest: PutUserRequest) => Promise<void>
}

class NewUserDialog extends Component<Props> {
    initialValues: PutUserRequest = {
        userName: '',
        store: [],
        email: '',
        role: 'store',
        status: 'active',
        password: '',
    }

    render() {
        const { open, handleClose, handleSubmit } = this.props
        return (
            <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
                <PlanProvider>
                    <PlanConsumer>
                        {({ plans }) => (
                            <StoreProvider>
                                <StoreConsumer>
                                    {({ stores }) => (
                                        <Formik onSubmit={handleSubmit} initialValues={this.initialValues} enableReinitialize>
                                            {({ values, isSubmitting }) => (
                                                <Form autoComplete="off">
                                                    <DialogTitle>Adicione um novo usuario </DialogTitle>
                                                    <DialogContent>
                                                        <NewUserForm stores={stores} values={values} />
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={handleClose}>Cancelar</Button>
                                                        <Button
                                                            disabled={isSubmitting}
                                                            color="primary"
                                                            variant="contained"
                                                            type="submit"
                                                        >
                                                            {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                                                        </Button>
                                                    </DialogActions>
                                                </Form>
                                            )}
                                        </Formik>
                                    )}
                                </StoreConsumer>
                            </StoreProvider>
                        )}
                    </PlanConsumer>
                </PlanProvider>
            </Dialog>
        )
    }
}

export default withStyles(styles)(NewUserDialog)
