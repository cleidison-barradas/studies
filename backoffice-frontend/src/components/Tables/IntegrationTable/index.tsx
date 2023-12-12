import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import { ReactComponent as GreenElipse } from '../../../assets/images/greenElipse.svg'
import { Box, Chip, Grid, TablePagination, Typography, withStyles } from '@material-ui/core'

import Pagination from '../../../interfaces/pagination'
import IntegrationLog from '../../../interfaces/integrationLog'
import { GetIntegrationLogRequest } from '../../../services/api/interfaces/ApiRequest'

import styles from './styles'
import moment from 'moment'
import 'moment/locale/pt-br'
import themePalette from '../../../styles/theme/themePalette'

interface Props {
  pagination: Pagination
  load: (data: GetIntegrationLogRequest) => void
  integrations: IntegrationLog[]
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
  page: number
  limit: number
}

class IntegrationTable extends Component<Props, State> {
  static defaultProps = {
    fetching: false,
    integrations: [],
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
      limit: 50,
      currentPage: 1,
      prevPage: null,
      nextPage: null,
    },
  }

  state: State = {
    page: 0,
    limit: 50,
  }

  handleChangePage = (page: number) => {
    const { load } = this.props

    this.setState((state: any) => ({
      ...state,
      page,
    }))
    setTimeout(() => {
      load({ page: this.state.page + 1, limit: this.state.limit })
    }, 800)
  }

  handleChangeRows = (limit: number) => {
    const { load } = this.props

    this.setState((state: any) => ({
      ...state,
      limit,
      page: 0,
    }))

    setTimeout(() => {
      load({ page: 1, limit })
    }, 800)
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

  private getStyles = (status: string) => {
    const palette = themePalette.palette

    switch (status) {
      case 'healthy':
        return {
          backgroundColor: palette.green.light,
          color: palette.primary.contrastText,
        }
      case 'warning':
        return {
          backgroundColor: palette.yellow.primary.light,
          color: palette.primary.main,
        }
      case 'problem':
        return {
          backgroundColor: palette.red.light,
          color: palette.primary.contrastText,
        }
      default:
        return {
          backgroundColor: palette.grey.primary.light,
          color: palette.primary.dark,
        }
    }
  }

  render() {
    const { limit } = this.state
    const { classes, integrations, pagination } = this.props

    return (
      <Box>
        <Grid container spacing={3}>
          {integrations.map((integration) => (
            <Grid item md={12} sm={6} lg={6} xl={6} xs={12} key={integration._id}>
              <PaperBlock>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography>{integration.storeName}</Typography>
                  <a className={classes.link} href={integration.storeUrl} target="_blank" rel="noreferrer">
                    {integration.storeUrl}
                  </a>
                </Box>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={4} lg={4} xl={4} xs={12}>
                    <Typography className={classes.textheader}>Erp</Typography>
                    <Box display="flex" alignItems="center">
                      <GreenElipse />
                      <Typography className={classes.textinfo}>{integration.erpName}</Typography>
                    </Box>
                  </Grid>
                  <Grid item md={12} sm={4} lg={4} xl={4} xs={12}>
                    <Typography className={classes.textheader}>Status da integração</Typography>
                    <Chip
                      label={this.getLabel(integration.status)}
                      classes={{ root: classes.status }}
                      style={this.getStyles(integration.status)}
                    />
                  </Grid>
                  <Grid item md={12} sm={4} lg={4} xl={4} xs={12}>
                    <Typography className={classes.textheader}>Data da última integração</Typography>
                    <Box display="flex" alignItems="center">
                      <GreenElipse />
                      <Typography className={classes.textinfo}>{moment(integration.lastSeen).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={2}>
                  <Typography className={classes.textheader}>Integração: {integration.extras['origin']}</Typography>
                </Box>
              </PaperBlock>
            </Grid>
          ))}
        </Grid>
        <Box mt={5}>
          {pagination && (
            <TablePagination
              page={pagination.currentPage - 1}
              component="div"
              rowsPerPage={limit}
              count={pagination.total}
              rowsPerPageOptions={[10, 30, 50, 100]}
              onChangePage={(event, page) => this.handleChangePage(page)}
              onChangeRowsPerPage={({ target: { value } }) => this.handleChangeRows(Number(value))}
            />
          )}
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(IntegrationTable)
