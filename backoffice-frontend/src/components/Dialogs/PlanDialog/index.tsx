import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    withStyles,
} from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Plan from '../../../interfaces/plan'
import PlanForm from '../../Forms/PlanForm'
import styles from './styles'
import * as yup from 'yup'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    open: boolean
    handleClose: (...args: any) => void
    handleSubmit: (data: Plan) => void
    plan?: Plan
}

class PlanDialog extends Component<Props> {
    validationSchema = yup.object({
        name: yup.string().required(),
        description: yup.string().required(),
        price: yup.number().required(),
    })

    handleSaveClick = async (values: Plan) => {
        const { handleSubmit, handleClose } = this.props
        handleSubmit(values)
        handleClose()
    }

    render() {
        const {
            open,
            handleClose,
            plan = {
                name: '',
                description: '',
                price: 0,
            },
        } = this.props

        return (
            <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
                <DialogTitle>Plano</DialogTitle>
                <Formik
                    initialValues={plan}
                    onSubmit={(values: Plan) => this.handleSaveClick(values)}
                    validationSchema={this.validationSchema}
                >
                    {({ isSubmitting, dirty }) => (
                        <Form>
                            <DialogContent>
                                <PlanForm />
                            </DialogContent>
                            <DialogActions>
                                <Grid container justify="space-between">
                                    <Grid item>
                                        <Button variant="contained" onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={isSubmitting || !dirty}
                                            color="primary"
                                        >
                                            {isSubmitting ? <CircularProgress size={22} /> : 'Salvar'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        )
    }
}

export default withStyles(styles)(PlanDialog)
