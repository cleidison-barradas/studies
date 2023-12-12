import React, { Component } from 'react'
import { ChangePassword } from '../../components/Forms'
import { withStyles } from '@material-ui/core/styles'
import styles from '../../components/Forms/ChangePassword/styles'
import SnackbarContext from '../../context/SnackbarContext'
import { authApi } from '../../services/api'
import customerxService from '../../services/customerx.service'

type Props = {
  classes: any
  location: Location
  history: any
  match: any
}

type State = {
  token: string | null
  userId: string | null
  loading: boolean
}

class ChangePasswordView extends Component<Props, State> {
  static contextType = SnackbarContext

  constructor(props: any) {
    super(props)

    this.state = {
      token: null,
      userId: null,
      loading: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const { location, history } = this.props
    const rawSearch = location.search
    const token = new URLSearchParams(rawSearch).get('token')
    const userId = new URLSearchParams(rawSearch).get('userId')
    if (!token || !userId) {
      history.replace('/')
    } else {
      this.setState({
        ...this.state,
        token,
        userId,
      })
    }

    customerxService.trackingScreen()
  }

  handleSubmit = async (value: any) => {
    const { openSnackbar } = this.context
    const { history } = this.props
    const { token, userId } = this.state
    const { password, passwordConfirm } = value

    if (password !== passwordConfirm) {
      openSnackbar('Digite senhas iguais', 'warning')
    } else {
      this.setState({
        ...this.state,
        loading: true,
      })
      const response = await authApi.put('/v1/resetPassword', {
        token,
        userId,
        password,
      })
      const { ok } = response

      if (ok) {
        openSnackbar('Senha alterada com sucesso')
        history.replace('/')
      } else {
        openSnackbar('Falha ao alterar senha', 'error')
      }
      this.setState({
        ...this.state,
        loading: false,
      })
    }
  }

  render() {
    const { classes } = this.props
    const { loading } = this.state
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <ChangePassword handleSubmit={this.handleSubmit} {...this.props} loading={loading} />
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ChangePasswordView)
