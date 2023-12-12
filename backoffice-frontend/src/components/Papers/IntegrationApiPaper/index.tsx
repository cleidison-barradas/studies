import { Box, Button, CircularProgress, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Store from '../../../interfaces/store'
import styles from './styles'
import { StoreConsumer } from '../../../context/StoreContext'
import IntegrationApiForm from '../../Forms/IntegrationApiForm'
import { IntegrationData } from '../../../interfaces/integrationApi'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    store: Store | null
    putApiIntegration: (_id: string, integrationData: IntegrationData) => Promise<void>,
    getApiIntegration: (_id: string) => Promise<void>,
    integrationData: IntegrationData
}

class IntegrationApiPaper extends Component<Props> {
    render() {
        const { store, integrationData } = this.props
        return (
            <StoreConsumer>
                {({ getApiIntegration, putApiIntegration }) => (
                    <Formik
                        initialValues={{token: integrationData?.trierData?.token, baseUrl: integrationData?.trierData?.baseUrl} || {}}
                        onSubmit={
                            async ({ token, baseUrl}) => {
                                await putApiIntegration(store?._id , { trierData:{token, baseUrl}})
                                await getApiIntegration(store?._id)
                            }
                        }
                    >
                        {({ isSubmitting, isValid, dirty }) => (
                            <Form>
                                <Box mb={3}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting || !isValid || !dirty}
                                    >
                                        {isSubmitting ? <CircularProgress size={22} color="secondary" /> : 'Salvar'}
                                    </Button>
                                </Box>
                                <IntegrationApiForm />
                                <Box>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting || !isValid || !dirty}
                                    >
                                        Salvar
                                    </Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                )}
            </StoreConsumer>
        )
    }
}

export default withStyles(styles)(IntegrationApiPaper)
