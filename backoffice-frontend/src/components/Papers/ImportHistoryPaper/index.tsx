import React, { Component } from 'react'
import { Button, withStyles, CircularProgress } from '@material-ui/core'

import styles from './styles'
import PaperBlock from '../../PaperBlock'
import ImportForm from '../../Forms/ImportForm'
import { Form, Formik } from 'formik'
import * as yup from 'yup'

interface Props {
    classes: any
    fetching: boolean
    success: boolean
    onSend: (data: any) => void
}

class ImportHistoryPaper extends Component<Props> {
    static defaultProps = {
        fetching: false,
        success: false,
    }

    schemaValidate = yup.object().shape({
        file: yup.mixed().required(''),
        updateAll: yup.bool(),
        store: yup.string().when('updateAll', {
            is: false,
            then: yup.string().required(),
        }),
    })

    render() {
        const { onSend, fetching } = this.props
        return (
            <div>
                <Formik
                    onSubmit={onSend}
                    validationSchema={this.schemaValidate}
                    initialValues={{ updateAll: true, file: null, store: '', fetching }}
                    enableReinitialize
                >
                    {({ errors }) => (
                        <Form>
                            <PaperBlock title="Importação de PMCs">
                                <ImportForm />
                            </PaperBlock>
                            <Button type="submit" variant="contained" color="primary">
                                Salvar{fetching && <CircularProgress size={20} color="primary" />}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default withStyles(styles)(ImportHistoryPaper)
