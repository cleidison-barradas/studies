import { Box, Button, CircularProgress, Grid, MenuItem, withStyles } from '@material-ui/core'
import { Formik, Form, Field } from 'formik'
import { Component } from 'react'
import IntegrationLog from '../../../interfaces/integrationLog'
import IntegrationStatus from '../../../interfaces/IntegrationStatus'
import Pagination from '../../../interfaces/pagination'
import { GetIntegrationLogRequest } from '../../../services/api/interfaces/ApiRequest'
import PaperBlock from '../../PaperBlock'
import SelectFormField from '../../SelectFormField'
import IntegrationTable from '../../Tables/IntegrationTable'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
  fetching: boolean
  pagination: Pagination
  integrations: IntegrationLog[]
  loadIntegrations: (data: GetIntegrationLogRequest) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class IntegrationPaper extends Component<Props> {

  integrationStatus: IntegrationStatus[] = [
    {
      _id: Math.random(),
      statusName: 'healthy'
    },
    {
      _id: Math.random(),
      statusName: 'warning'
    },
    {
      _id: Math.random(),
      statusName: 'problem'
    },
    {
      _id: Math.random(),
      statusName: 'unknown'
    },
  ]

  static defaultProps = {
    fetching: false,
    integrations: [],
    pagination: {
      page: 0,
      pages: 1,
      total: 0,
      limit: 10,
      currentPage: 0,
      prevPage: null,
      nextPage: null,
    },
  }
  componentDidMount() {
    this.onLoad({})
  }

  onLoad = (data: GetIntegrationLogRequest) => {
    const { loadIntegrations } = this.props

    loadIntegrations(data)
  }

  private getLabel = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Normal'
      case 'warning':
        return 'Atenção'
      case 'problem':
        return 'Crítico'
      default:
        return 'Desconhecido'
    }
  }

  render() {
    const { fetching, integrations, pagination, classes } = this.props

    return (
      <PaperBlock>
        <Formik initialValues={{ search: undefined, status: '' }} onSubmit={this.onLoad} enableReinitialize>
          {({ isSubmitting, resetForm }) => (
            <Form>
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4} sm={4} xl={4} lg={4}>
                    <Field
                      name="search"
                      autoComplete="off"
                      placeholder="Pesquise pelo nome ou URL da farmácia"
                      className={classes.input}
                      component={TextFormField}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sm={4} xl={4} lg={4}>
                    <Field name="status" label="Status de integração" component={SelectFormField}>
                      {this.integrationStatus.map((integration, index) => (
                        <MenuItem key={index} value={integration.statusName}>{this.getLabel(integration.statusName)}</MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12} md={4} sm={4} xl={4} lg={4}>
                    <Box>
                      <Button type="submit" className={classes.searchbutton} color="primary" variant="contained">
                        Pesquisar
                      </Button>

                      <Button
                        className={classes.searchbutton}
                        color="default"
                        onClick={() => {
                          this.onLoad({})
                          resetForm()
                        }}
                        variant="contained"
                      >
                        Resetar
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                {fetching ? (
                  <Box mt={5} display="flex" justifyContent="center" width="100%">
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <IntegrationTable integrations={integrations} pagination={pagination} load={this.onLoad} />
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(IntegrationPaper)
