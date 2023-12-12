import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import styles from './styles'

type RecoverProps = {
  loading?: boolean,
  classes: any,
  deco?: boolean,
}

class Recovered extends Component<RecoverProps> {

  static defaultProps = {
    loading: false,
    deco: false,
  }


  state = {
    recovered: false
  }



  render() {
    const { classes, loading } = this.props

    return (
      <Paper className={classNames(classes.paperWrap)}>
        <div className={classes.topBar}>
          <Link to="/" className={classes.brand}>
            <img src={mypharmaLogo} alt="MyPharma" />
          </Link>
        </div>
        <section className={classes.formWrap}>
          <h1>Pedido de alteração enviado com sucesso!</h1>
          <p>Para sua segurança enviamos um link para trocar de senha no seu e-mail cadastrado.</p>
          <p>Pode atualizar ao acessar o link e digitar sua nova senha</p>
          <div className={classes.btnArea}>
            <Button variant="contained" component={Link} to="/" className={classes.btn} size="large" type="submit" disabled={loading}>
              Voltar ao login
            </Button>
          </div>
        </section>
      </Paper>

    )
  }
}

export default withStyles(styles)(Recovered)
