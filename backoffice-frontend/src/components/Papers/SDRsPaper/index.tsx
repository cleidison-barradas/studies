import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { Box, Button, Typography, withStyles } from '@material-ui/core'
import { isEqual } from 'lodash'

import { GetSDRsRequest } from '../../../services/api/interfaces/ApiRequest'
import Pagination from '../../../interfaces/pagination'
import SDR from '../../../interfaces/SDR'

import PaperBlock from '../../PaperBlock'
import SDRFilterForm from '../../Forms/SDRFilterForm'
import SDRTable from '../../Tables/SDRTable'

import styles from './styles'

interface Props {
  sdrs: SDR[]
  pagination?: Pagination
  getSDRs: (data?: GetSDRsRequest) => Promise<void>
  classes: Record<keyof ReturnType<typeof styles>, string>
  history: RouteComponentProps['history']
}

export class SDRsPaper extends Component<Props> {
  initialValues: GetSDRsRequest = {
    limit: 20,
    page: 1
  }

  async componentDidMount() {
    const { getSDRs } = this.props
    await getSDRs()
  }

  render() {
    const { sdrs, getSDRs, pagination, classes, history } = this.props
    return (
      <Box>
        <Box display='flex' justifyContent='space-between'>
          <Typography className={classes.headertitle}>SDR's</Typography>
          <Box>
            <Button className={classes.btn} variant='contained' color='primary' onClick={() => history.push('/sdrs/new')}>
              Cadastrar SDR
            </Button>
          </Box>
        </Box>
        <Formik
          onSubmit={getSDRs}
          enableReinitialize
          initialValues={this.initialValues}
        >
          {({ isSubmitting, initialValues, values, resetForm }) => (
            <Form>
              <Box />
              <PaperBlock>
                <SDRFilterForm
                  sdrs={sdrs}
                  getSDRs={getSDRs}
                  equal={isEqual(initialValues, values)}
                  isSubmitting={isSubmitting}
                  resetForm={resetForm}
                />
                <SDRTable
                  sdrs={sdrs}
                  pagination={pagination}
                />
              </PaperBlock>
            </Form>
          )}
        </Formik>
      </Box>

    )
  }
}

export default withStyles(styles)(SDRsPaper)
