import { Box, Button, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { ErpConsumer } from '../../../context/ErpContext'
import Erp from '../../../interfaces/erp'
import { BasicFilterRequest } from '../../../services/api/interfaces/ApiRequest'
import ErpForm from '../../Forms/ErpForm'
import PaperBlock from '../../PaperBlock'
import styles from './styles'

type Props = {
    classes: Record<keyof ReturnType<typeof styles>, string>
    onSubmit: (erp: Erp) => Promise<void>
    history: RouteComponentProps['history']
    getErpVersions: (data?: BasicFilterRequest) => Promise<void>
    id?: Erp['_id']
    getErp?: (id: string) => Promise<void>
}

class ErpPaper extends Component<Props> {
    initialValues: Erp = {
        name: '',
        _id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        versions: [],
    }

    async componentDidMount() {
        const { getErpVersions, getErp, id } = this.props
        await getErpVersions()

        if (id && getErp) {
            await getErp(id)
        }
    }

    onSubmit = async (erp: Erp) => {
        const { onSubmit, history } = this.props
        erp.versions = erp.versions.map((value) => value._id) as any
        await onSubmit(erp)
        history.push('/erps')
    }

    render() {
        const { id } = this.props
        return (
            <ErpConsumer>
                {({ erp }) => (
                    <Formik
                        initialValues={erp && id ? erp : this.initialValues}
                        enableReinitialize
                        onSubmit={this.onSubmit}
                    >
                        {({ isSubmitting, dirty }) => (
                            <Form>
                                <Box mb={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting || !dirty}
                                    >
                                        Salvar
                                    </Button>
                                </Box>
                                <PaperBlock>
                                    <ErpForm />
                                </PaperBlock>
                            </Form>
                        )}
                    </Formik>
                )}
            </ErpConsumer>
        )
    }
}

export default withStyles(styles)(ErpPaper)
