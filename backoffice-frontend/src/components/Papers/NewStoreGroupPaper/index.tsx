import { Box, Button, CircularProgress, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import { isEqual } from 'lodash'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Store from '../../../interfaces/store'
import StoreGroup from '../../../interfaces/storeGroup'
import { GetStoresRequest } from '../../../services/api/interfaces/ApiRequest'
import StoreGroupForm from '../../Forms/StoreGroupForm'
import PaperBlock from '../../PaperBlock'
import styles from './styles'
import * as yup from 'yup'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
    stores: Store[]
    getStores: (data?: GetStoresRequest) => Promise<void>
}

class NewStoreGroupPaper extends Component<Props> {
    initialValues: StoreGroup = {
      name: '',
      stores: []
    }

    validationSchema = yup.object({
      name: yup.string().required(),
      stores: yup.array().min(1)
    })

    render () {
      const { stores, getStores } = this.props
      return (
            <Formik
                initialValues={this.initialValues}
                onSubmit={(values) => console.log(values)}
                validationSchema={this.validationSchema}
            >
                {({ isSubmitting, isValid, values }) => (
                    <Form>
                        <Box mb={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isSubmitting || !isValid || isEqual(this.initialValues, values)}
                            >
                                {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                            </Button>
                        </Box>
                        <PaperBlock title="Grupo de loja">
                            <StoreGroupForm stores={stores} getStores={getStores} />
                        </PaperBlock>
                    </Form>
                )}
            </Formik>
      )
    }
}

export default withStyles(styles)(NewStoreGroupPaper)
