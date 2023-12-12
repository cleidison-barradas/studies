import { Box, Button, CircularProgress, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import Store from '../../../interfaces/store'
import { MarketingForm } from '../../Forms'
import styles from './styles'
import { StoreConsumer } from '../../../context/StoreContext'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    store: Store | null
}

class MarketingPaper extends Component<Props> {
    render() {
        const { store } = this.props
        return (
            <StoreConsumer>
                {({ postStore }) => (
                    <Formik
                        initialValues={store?.settings || {}}
                        onSubmit={async (settings) => await postStore(store?._id!, { store: { ...store, settings, _id: store!._id } })}
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
                                <MarketingForm />
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

export default withStyles(styles)(MarketingPaper)
