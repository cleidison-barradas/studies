import { Box, Button, withStyles } from '@material-ui/core'
import { Form, Formik } from 'formik'
import { isEqual } from 'lodash'
import React, { Component } from 'react'
import Store from '../../../interfaces/store'
import StoreGroup from '../../../interfaces/storeGroup'
import { GetStoresRequest } from '../../../services/api/interfaces/ApiRequest'
import StoreGroupForm from '../../Forms/StoreGroupForm'
import PaperBlock from '../../PaperBlock'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    storeGroup?: StoreGroup
    stores: Store[]
    getStores: (data?: GetStoresRequest) => Promise<void>
}

class StoreGroupPaper extends Component<Props> {
  render () {
    const { storeGroup = {}, stores, getStores } = this.props
    return (
            <Formik initialValues={storeGroup} onSubmit={(values) => console.log(values)}>
                {({ isSubmitting, isValid, values }) => (
                    <Form>
                        <Box mb={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={isSubmitting || !isValid || isEqual(storeGroup, values)}
                            >
                                Salvar
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

export default withStyles(styles)(StoreGroupPaper)
