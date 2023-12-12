import { Box, Button } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { BillboardConsumer } from '../../../context/BillboardContext'
import { Billboard } from '../../../interfaces/billboard'
import { PutBillboardRequest } from '../../../services/api/interfaces/ApiRequest'
import BillboardForm from '../../Forms/BillboardForm'
import PaperBlock from '../../PaperBlock'

interface Props extends RouteComponentProps {
    id?: string
    getBillboard?: (id?: Billboard['_id']) => Promise<void>
}

class BillboardPaper extends Component<Props> {
    initialValues: PutBillboardRequest = {
        billboard: {
            title: '',
            message: '',
            startAt: new Date(),
            endAt: new Date(),
            stores: [],
            type: 'info',
            active: true,
        },
    }

    async componentDidMount() {
        const { getBillboard, id } = this.props
        if (id) {
            await getBillboard!(id)
        }
    }

    render() {
        const { history } = this.props
        return (
            <BillboardConsumer>
                {({ putBillboard, billboard }) => (
                    <PaperBlock title="Criar novo aviso">
                        <Formik
                            initialValues={billboard ? { billboard } : this.initialValues}
                            onSubmit={async (data) => {
                                data.billboard.stores = data.billboard.stores.map(({ _id }: any) => _id)
                                await putBillboard(data)
                                history.push('/billboard')
                            }}
                            enableReinitialize
                        >
                            {({ values, dirty }) => (
                                <Form>
                                    <BillboardForm message={values.billboard.message} />
                                    <Box mt={3}>
                                        <Button disabled={!dirty} variant="contained" color="primary" type="submit">
                                            Salvar
                                        </Button>
                                    </Box>
                                </Form>
                            )}
                        </Formik>
                    </PaperBlock>
                )}
            </BillboardConsumer>
        )
    }
}

export default withRouter(BillboardPaper)
