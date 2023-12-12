import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { TextField, IconButton, InputAdornment, Paper, Box, CircularProgress } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import Formized from '../../Formized'
import { FormProvider, FormConsumer } from '../../../context/FormContext'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import styles from './styles'

type ChangeProps = {
  loading?: boolean
  classes: any
  handleSubmit: (values: any) => void
  location: any
}

class ChangePasswordForm extends Component<ChangeProps> {
  static defaultProps = {
    loading: false,
    handleSubmit: (values: any) => null,
  }

  state = {
    showPassword: false,
    showPasswordConfirm: false,
  }

  handleClickShowPassword = () => {
    this.setState({
      ...this.state,
      showPassword: !this.state.showPassword,
    })
  }

  handleClickShowPasswordConfirm = () => {
    this.setState({
      ...this.state,
      showPasswordConfirm: !this.state.showPasswordConfirm,
    })
  }

  handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  render() {
    const { classes, loading, handleSubmit } = this.props
    const { showPassword, showPasswordConfirm } = this.state

    return (
      <FormProvider>
        <FormConsumer>
          {({ form, onFormChange }) => {
            const values = {
              password: '',
              passwordConfirm: '',
              ...form.passwordChange,
            }

            return (
              <>
                <Paper className={classNames(classes.paperWrap, classes.petal)}>
                  <div className={classes.topBar}>
                    <Link to="/" className={classes.brand}>
                      <img src={mypharmaLogo} alt="MyPharma" />
                    </Link>
                  </div>
                  <section className={classes.formWrap}>
                    {loading ? (
                      <Box mt={9}>
                        <CircularProgress color="secondary" size="50%" />
                      </Box>
                    ) : (
                      <>
                        <h1 className={classes.description}>Antes de continuar</h1>
                        <p>Troque sua senha</p>

                        <Formized name="passwordChange" onChange={onFormChange} onFinish={handleSubmit}>
                          <Box mb={3} mt={5}>
                            <TextField
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              label="Nova Senha"
                              fullWidth
                              variant="outlined"
                              color="secondary"
                              required
                              value={values.password}
                              className={classes.input}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment
                                    position="end"
                                    style={{
                                      color: '#fff',
                                    }}
                                  >
                                    <IconButton
                                      color="inherit"
                                      aria-label="Exibir senha"
                                      onClick={this.handleClickShowPassword}
                                      onMouseDown={this.handleMouseDownPassword}
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>

                          <TextField
                            name="passwordConfirm"
                            type={showPasswordConfirm ? 'text' : 'password'}
                            label="Repita a nova senha"
                            variant="outlined"
                            fullWidth
                            required
                            className={classes.input}
                            value={values.confirmPassword}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  style={{
                                    color: '#fff',
                                  }}
                                >
                                  <IconButton
                                    color="inherit"
                                    aria-label="Exibir senha"
                                    onClick={this.handleClickShowPasswordConfirm}
                                    onMouseDown={this.handleMouseDownPassword}
                                  >
                                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />

                          <div className={classes.btnArea}>
                            <Button variant="contained" color="primary" size="large" type="submit" disabled={loading}>
                              Atualizar senha
                            </Button>
                          </div>
                          <Box mt={2}>
                            <Button size="large" fullWidth>
                              Voltar
                            </Button>
                          </Box>
                        </Formized>
                      </>
                    )}
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

export default withStyles(styles)(ChangePasswordForm)
