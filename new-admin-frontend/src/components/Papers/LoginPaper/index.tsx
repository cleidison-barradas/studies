import { Button, CircularProgress, Paper, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Formik, Form } from 'formik'
import React, { Component } from 'react'
import styles from './styles'
import Credential from '../../../interfaces/credential'
import { Link } from 'react-router-dom'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import { LoginForm } from '../../Forms'
import { AuthConsumer } from '../../../context/AuthContext'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class LoginPaper extends Component<Props> {
  initialValues: Credential = {
    password: '',
    userName: '',
  }

  render() {
    const { classes } = this.props
    return (
      <AuthConsumer>
        {({ requestSession, fetching }) => (
          <Formik onSubmit={requestSession} initialValues={this.initialValues}>
            {({ isSubmitting }) => (
              <Form>
                <Paper className={classNames(classes.paperWrap)}>
                  <div className={classes.topBar}>
                    <span className={classes.brand}>
                      <img src={mypharmaLogo} alt="MyPharma" />
                    </span>
                  </div>

                  <section className={classes.formWrap}>
                    <LoginForm />
                    <div className={classes.optArea}>
                      <Link to="/recover/password" className={classes.ButtonLink}>
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className={classes.btnArea}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        disabled={isSubmitting || fetching}
                        classes={{
                          root: classes.loginbtn,
                        }}
                      >
                        {isSubmitting || fetching ? <CircularProgress color="secondary" size={20} /> : 'Login'}
                      </Button>
                    </div>
                  </section>
                </Paper>
              </Form>
            )}
          </Formik>
        )}
      </AuthConsumer>
    )
  }
}

export default withStyles(styles)(LoginPaper)
