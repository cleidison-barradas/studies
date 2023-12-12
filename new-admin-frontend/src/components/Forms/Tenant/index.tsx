import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Paper, Select, MenuItem, CircularProgress, Typography, Box } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import styles from './styles'
import Tenant from '../../../interfaces/tenant'
import { AuthConsumer } from '../../../context/AuthContext'
import Credential from '../../../interfaces/credential'

type Props = {
  classes: any
  handleSubmit: (data: Credential) => void
  history: any
  requestUserSetTenant: any
  tenants: Tenant[]
  accessToken: string
  fetching: boolean
}

type State = {
  tenant: Tenant | null
}

class TenantForm extends Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      tenant: null,
    }
    this.setTenant = this.setTenant.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    const { tenants, accessToken } = this.props
    const { history } = this.props
    if (!tenants || !accessToken) {
      history.goBack()
    }
  }

  setTenant(_id: string) {
    this.setState({
      ...this.state,
      tenant: {
        _id,
      },
    })
  }

  async onSubmit() {
    const { tenant } = this.state
    const { requestUserSetTenant, history } = this.props
    if (tenant) {
      const response = requestUserSetTenant(tenant)
      if (response) {
        history.replace('/')
      }
    }
  }

  render() {
    const { classes,  fetching, tenants } = this.props
    return (
      <AuthConsumer>
        {({ logout }) => (
          <Paper className={classNames(classes.paperWrap)}>
            <section className={classes.formWrap}>
              <div className={classes.topBar}>
                <Link to="/" className={classes.brand}>
                  <img src={mypharmaLogo} alt="MyPharma" />
                </Link>
              </div>
              {fetching ? (
                <CircularProgress />
              ) : (
                <div
                  style={{
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography className={classes.tenantitle}>
                      Foram encontradas {tenants && tenants.length} farmacia{tenants.length >= 2 ? 's' : ''} vinculadas a este
                      usuario
                    </Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.tenantcaption} align="center">
                      Selecione uma para continuar
                    </Typography>
                    <Select
                      fullWidth
                      classes={{
                        root: classes.select,
                      }}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'right',
                        },
                        getContentAnchorEl: null,
                      }}
                      onChange={(e: any) => this.setTenant(e.target.value)}
                    >
                      {tenants.map(({ _id, name, tenant }: Tenant) => (
                        <MenuItem value={_id} key={_id}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      disabled={fetching}
                      onClick={this.onSubmit}
                      classes={{
                        root: classes.loginbtn,
                      }}
                    >
                      {fetching ? <CircularProgress /> : 'Entrar'}
                    </Button>
                    <Box mt={2}>
                      <Button
                        onClick={logout}
                        fullWidth
                        classes={{
                          root: classes.gobackbtn,
                        }}
                        disabled={fetching}
                      >
                        Voltar
                      </Button>
                    </Box>
                  </Box>
                </div>
              )}
            </section>
          </Paper>
        )}
      </AuthConsumer>
    )
  }
}

export default withStyles(styles)(TenantForm)
