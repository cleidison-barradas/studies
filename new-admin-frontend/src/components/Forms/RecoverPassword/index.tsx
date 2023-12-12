import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { TextField, FormControl, Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Formized from '../../Formized'
import { FormProvider, FormConsumer } from '../../../context/FormContext'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import styles from './styles'

type RecoverProps = {
  fetching?: boolean,
  classes: any,
  handleSubmit: (values: any) => void
}

class Recover extends Component<RecoverProps> {

  static defaultProps = {
    handleSubmit: (values: any) => null
  }

  state = {
    recovered: false
  }

  render() {
    const { classes, fetching, handleSubmit } = this.props

    return (
      <FormProvider>
        <FormConsumer>
          {({ form, onFormChange }) => {
            const values = {
              email: '',
              ...form.recover
            }

            return (
              <>

                <Paper className={classNames(classes.paperWrap)}>
                  <div className={classes.topBar}>
                    <Link to="/" className={classes.brand}>
                      <img src={mypharmaLogo} alt="MyPharma" />
                    </Link>
                  </div>

                  <section className={classes.formWrap}>
                    <Formized
                      name="recover"
                      onChange={onFormChange}
                      onFinish={handleSubmit}
                    >
                      <FormControl className={classes.formControl}>
                        <TextField
                          name="email"
                          label="Email Cadastrado"
                          className={classes.field}
                          value={values.email}
                          inputProps={{
                            className: classes.input
                          }}
                          InputLabelProps={{
                            className: classes.label
                          }}
                          required
                        />
                      </FormControl>
                      <div className={classes.btnArea}>
                        <Button variant="contained" className={classes.btn} size="large" type="submit" disabled={fetching}>
                          REDEFINIR SENHA
                        </Button>
                      </div>
                      <div className={classes.btnArea}>
                        <Button component={Link} to="/" color="inherit" className={classes.ButtonLink}>Voltar ao login</Button>
                      </div>
                    </Formized>
                  </section>
                </Paper>
              </>
            )
          }}
        </FormConsumer>
      </FormProvider>
    )
  }
}

export default withStyles(styles)(Recover)
