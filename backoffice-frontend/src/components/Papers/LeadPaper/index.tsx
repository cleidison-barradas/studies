import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Form, Formik } from 'formik'
import { Button, CircularProgress, Grid, Typography, withStyles } from '@material-ui/core'
import { isEqual } from 'lodash'

import Lead from '../../../interfaces/Lead'
import { PostLeadRequest } from '../../../services/api/interfaces/ApiRequest'

import LeadForm from '../../Forms/LeadForm'

import { ReactComponent as GoBackArrow } from '../../../assets/images/icons/blueBackArrow.svg'
import styles from './styles'

interface Props {
  history: RouteComponentProps['history']
  lead?: Lead
  _id?: string
  classes: Record<keyof ReturnType<typeof styles>, string>
  getLead: (id: string) => Promise<void>
  updateLead?: (data: PostLeadRequest) => Promise<void>
}

interface State {
  lead: Lead
}

export class LeadPaper extends Component<Props, State> {
  lead: State = {
    lead: {
      _id: '',
      name: '',
      storeName: '',
      cnpj: '',
      storePhone: '',
      ownerPhone: '',
      email: '',
      colaborator: '',
      colaboratorCpf: '',
      colaboratorCnpj: '',
      colaboratorEmail: '',
      colaboratorPhone: '',
      statusHistory: [],
      status: 'open',
      sdr: {
        name: '',
        email: '',
        willReceveLeadsEmail: true
      },
    },
  }

  save = async (lead: Lead) => {
    const { history, _id, updateLead } = this.props

    if (_id) {
      await updateLead!({ ...lead })
    }

    history.replace('/leads')
  }

  async componentDidMount() {
    const { getLead, _id } = this.props
    if (_id && getLead) {
      await getLead(_id)
    }
  }

  render() {
    const { classes, lead } = this.props

    return (
      <>
        <Formik
          initialValues={lead || this.state.lead}
          enableReinitialize
          onSubmit={this.save}
        >
          {({ isSubmitting, values, isValid, initialValues }) => (
            <Form>
              <Grid container alignItems='center' justify='space-between' className={classes.header}>
                <Grid item className={classes.headergrid1} xs={12} md={12} lg={6}>
                  <Grid container alignItems='center' spacing={2}>
                    <Link to='/leads' className={classes.goback}>
                      <GoBackArrow />
                    </Link>
                    <Typography className={classes.gobacktext}>
                      Lead {values._id}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <LeadForm values={{ ...values }} />
              <Grid
                container={window.innerWidth < 1200}
                alignItems='center'
                justify='space-between'
                md={12}
              >
                <Button
                  type='submit'
                  color='primary'
                  variant='contained'
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

export default withStyles(styles)(LeadPaper)
