import { Button, CircularProgress, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'

import Store from '../../../interfaces/store'
import styles from './styles'
import { isEqual } from 'lodash'
import { Formik, Form } from 'formik'
import { Link, RouteComponentProps } from 'react-router-dom'
import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'
import MockupsImage from '../../Forms/MockupsImage'
import { mockups } from './mockups'
import Mockups from '../../../interfaces/mockups'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  store?: Store
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  fetching: any
  success: any
  getMocks: () => Promise<void>
  updateMocks: (data: Mockups) => Promise<void>
  mocks: Mockups | null
  history: RouteComponentProps['history']
}

interface IMockups {
  name: string
  field: string
}

class UpdateMockupsPaper extends Component<Props> {
  async componentDidMount() {
    const { getMocks } = this.props
    await getMocks()
  }

  save = async (data: Mockups) => {
    const { updateMocks, history } = this.props
    await updateMocks(data)
    history.push('/products')
  }

  render() {
    const {
      fetching,
      classes,
      mocks = {
        tarja_vermelha_nao_generico: '',
        generico_tarja_vermelha: '',
        tarja_preta_nao_generico: '',
        generico_tarja_preta: '',
        generico_otc: '',
        sem_imagem: '',
      },
    } = this.props

    return (
      <Formik initialValues={{ ...mocks }} onSubmit={this.save} enableReinitialize>
        {({ isSubmitting, values, initialValues }) => (
          <Form>
            {fetching && <LinearProgress />}
            <Grid container alignItems="center" justify="space-between" className={classes.header}>
              <Grid item className={classes.headergrid1} xs={12} md={12} lg={6}>
                <Grid container alignItems="center" spacing={2}>
                  <Link to="/products" className={classes.goback}>
                    <GoBackArrow />
                  </Link>
                  <Typography className={classes.gobacktext}>Atualizar imagens de produtos tarjados</Typography>
                </Grid>
              </Grid>
              <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between">
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={isSubmitting || isEqual(initialValues, values)}
                >
                  {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
              </Grid>
            </Grid>
            {mockups.map((image: IMockups, index) => (
              <div key={index}>
                <MockupsImage key={index} title={image.name} field={image.field} classes={classes} mode={null} />
              </div>
            ))}
            <Grid container={window.innerWidth < 1200} alignItems="center" justify="space-between" md={12}>
              <Button type="submit" color="primary" variant="contained" disabled={isSubmitting || isEqual(initialValues, values)}>
                {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(styles)(UpdateMockupsPaper)
