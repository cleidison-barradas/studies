import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { Button, CircularProgress, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'
import * as yup from 'yup'
import { isEqual } from 'lodash'

import SDR from '../../../interfaces/SDR'
import { GetSDRsRequest, PostSDRRequest } from '../../../services/api/interfaces/ApiRequest'

import NewSDRForm from '../../Forms/NewSDRForm'

import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'
import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  fetching?: boolean
  sdr?: SDR
  _id?: string
  save: (data: SDR) => Promise<void>
  getSDR: (id: string) => Promise<void>
  postSDR: (data: PostSDRRequest) => Promise<void>
  updateSDR?: (data: PostSDRRequest) => Promise<void>
  history: RouteComponentProps['history']
}

interface State {
  sdr: SDR
}

export class SDRPaper extends Component<Props, State> {
  state: State = {
    sdr: {
      name: '',
      email: '',
      willReceveLeadsEmail: true
    }
  }

  initialValues: GetSDRsRequest = {
    limit: 10,
    page: 1
  }

  async componentDidMount() {
    const { getSDR, _id } = this.props
    if (_id && getSDR) {
      await getSDR(_id)
    }
  }

  save = async (sdr: SDR) => {
    const { postSDR, history, _id, updateSDR } = this.props
    if (_id) {
      await updateSDR!({ ...sdr })
    } else {
      await postSDR({ ...sdr })
    }
    history.replace('/sdrs')
  }

  validationSchema = yup.object({
    name: yup.string().required('O nome é um campo obrigatório!'),
    email: yup.string().required('O email é um campo obrigatório!'),
    willReceveLeadsEmail: yup.boolean().required('É necessário definir um status para o SDR!')
  })

  render() {
    const { classes, _id, fetching, sdr } = this.props
    return (
      <>
        <Formik
          initialValues={sdr || this.state.sdr}
          enableReinitialize
          onSubmit={this.save}
          validationSchema={this.validationSchema}
        >
          {({ isSubmitting, values, isValid, initialValues }) => (
            <Form>
              {fetching && <LinearProgress />}
              <Grid container alignItems="center" justify="space-between" className={classes.header}>
                <Grid item className={classes.headergrid1} xs={12} md={12} lg={6}>
                  <Grid container alignItems="center" spacing={2}>
                    <Link to="/sdrs" className={classes.goback}>
                      <GoBackArrow />
                    </Link>
                    <Typography className={classes.gobacktext}>
                      {_id ? 'Atualizar SDR' : 'Cadastrar SDR'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between">
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={isSubmitting || !isValid || isEqual(initialValues, values)}
                  >
                    {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                  </Button>
                </Grid>
              </Grid>
              <NewSDRForm values={{ ...values }} />
              <Grid
                container={window.innerWidth < 1200}
                alignItems="center"
                justify="space-between"
                md={12}
              >
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting || !isValid || isEqual(initialValues, values)}
                >
                  {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
              </Grid>

            </Form>
          )}
        </Formik>
      </>
    )
  }
}

export default withStyles(styles)(SDRPaper)
