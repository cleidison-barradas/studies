import { Button, CircularProgress, Grid, withStyles } from '@material-ui/core'
import { startOfDay } from 'date-fns'
import { Field, FieldProps } from 'formik'
import { DateRange } from 'materialui-daterange-picker'
import moment from 'moment'
import React, { Component } from 'react'
import User from '../../../interfaces/user'
import { GetUsersRequest } from '../../../services/api/interfaces/ApiRequest'
import DatePickerDialog from '../../Dialogs/DatePickerDialog'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    users: User[]
    getUsers: (data?: GetUsersRequest) => Promise<void>
    isSubmitting: boolean
    equal: boolean
}

interface State {
    dateModalOpen: boolean
}

class UserFilterForm extends Component<Props, State> {
    state = {
        dateModalOpen: false,
    }

    toggleModal = () => {
        this.setState({
            ...this.state,
            dateModalOpen: !this.state.dateModalOpen,
        })
    }

    render() {
        const { dateModalOpen } = this.state
        const { equal, isSubmitting } = this.props

        return (
            <React.Fragment>
                <Grid container spacing={2}>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Field name="query" label="Username ou Email do Usuário" component={TextFormField} />
                    </Grid>
                    <Grid item lg={2} md={12} sm={12} xs={12}>
                        <Field name="startDate">
                            {({ field: { value }, form }: FieldProps) => (
                                <Button onClick={this.toggleModal} fullWidth>
                                    {value ? (
                                        <React.Fragment>
                                            {value && moment(value).format('DD-MM-YYYY')}
                                            {form.values.endDate &&
                                                ' - ' + moment(form.values.endDate).format('DD-MM-YYYY')}
                                        </React.Fragment>
                                    ) : (
                                        'Filtrar por data'
                                    )}
                                </Button>
                            )}
                        </Field>
                    </Grid>
                    <Grid item lg={2} md={12} sm={12} xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting || equal}
                        >
                            {isSubmitting ? <CircularProgress size={22} color="secondary" /> : 'Procurar'}
                        </Button>
                    </Grid>
                </Grid>
                <Field name="createdAt">
                    {({ form }: FieldProps) => (
                        <DatePickerDialog
                            open={dateModalOpen}
                            toggle={this.toggleModal}
                            clear={() => {
                                form.setFieldValue('startDate', undefined)
                                form.setFieldValue('endDate', undefined)
                            }}
                            onChange={(data: DateRange) => {
                                if (data.startDate) form.setFieldValue('startDate', startOfDay(data.startDate))
                                if (data.endDate) form.setFieldValue('endDate', startOfDay(data.endDate))
                            }}
                        />
                    )}
                </Field>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(UserFilterForm)
