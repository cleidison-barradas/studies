import { Button, CircularProgress, Grid, withStyles } from '@material-ui/core'
import { Field, FieldProps } from 'formik'
import { DateRange } from 'materialui-daterange-picker'
import moment from 'moment'
import React, { Component } from 'react'
import Category from '../../../interfaces/category'
import { GetProductRequest } from '../../../services/api/interfaces/ApiRequest'
import DatePickerDialog from '../../Dialogs/DatePickerDialog'
import SelectFormField from '../../SelectFormField'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    categories: Category[]
    isSubmitting: boolean
    equal: boolean
    getProduct: (data: GetProductRequest) => Promise<void>
}

interface State {
    dateModalOpen: boolean
}

interface OthersFilter {
    label: string
    value?: string
}

class ProductFilterForm extends Component<Props, State> {
    state = {
        dateModalOpen: false,
    }

    otherFilterOptions: OthersFilter[] = [
        {
            label: 'Outros',
        },
        {
            label: 'Sem categoria',
            value: 'nocategory',
        },
        {
            label: 'Sem imagem',
            value: 'noimage',
        },
    ]

    toggleModal = () => {
        this.setState({
            ...this.state,
            dateModalOpen: !this.state.dateModalOpen,
        })
    }

    render() {
        const { categories, isSubmitting, equal } = this.props
        const { dateModalOpen } = this.state
        return (
            <Grid container spacing={3}>
                <Grid item xl={3} lg={3} md={6} sm={12} xs={12}>
                    <Field component={TextFormField} name="name" label="Nome do Produto ou EAN" />
                </Grid>
                <Grid item xl={2} lg={2} md={6} sm={12} xs={12}>
                    <Field component={SelectFormField} name="category" label="Categoria" options={categories} />
                </Grid>
                <Grid item xl={2} lg={2} md={6} sm={12} xs={12}>
                    <Field
                        component={SelectFormField}
                        valueField="value"
                        labelField="label"
                        name="others"
                        label="Outros"
                        options={this.otherFilterOptions}
                    />
                </Grid>
                <Grid item xl={2} lg={2} md={12} sm={12} xs={12}>
                    <Field name="createdAt">
                        {({ field: { value } }: FieldProps) => (
                            <Button onClick={this.toggleModal} fullWidth>
                                {value ? (
                                    <React.Fragment>
                                        {value.startDate && moment(value.startDate).format('DD-MM-YYYY')}
                                        {value.endDate && ' - ' + moment(value.endDate).format('DD-MM-YYYY')}
                                    </React.Fragment>
                                ) : (
                                    'Filtrar por data'
                                )}
                            </Button>
                        )}
                    </Field>
                </Grid>
                <Grid item xl={2} lg={3} md={12} sm={12} xs={12}>
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || equal}>
                        {isSubmitting ? <CircularProgress size={30} /> : 'Filtrar'}
                    </Button>
                </Grid>
                <Field name="createdAt">
                    {({ form }: FieldProps) => (
                        <DatePickerDialog
                            open={dateModalOpen}
                            toggle={this.toggleModal}
                            clear={() => {
                                form.setFieldValue('createdAt', undefined)
                                form.setFieldValue('start', undefined)
                                form.setFieldValue('end', undefined)
                            }}
                            onChange={(data: DateRange) => {
                                form.setFieldValue('createdAt', data)
                                form.setFieldValue('start', data.startDate)
                                form.setFieldValue('end', data.endDate)
                            }}
                        />
                    )}
                </Field>
            </Grid>
        )
    }
}

export default withStyles(styles)(ProductFilterForm)
