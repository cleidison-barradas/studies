import React, { Component } from 'react'
import { IconButton, InputAdornment } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import { Field } from 'formik'
import TextFormField from '../../TextFormField'

type LoginProps = {
  classes: any
}

class LoginForm extends Component<LoginProps> {
  state = {
    showPassword: false,
  }

  handleClickShowPassword = () => {
    const { showPassword } = this.state
    this.setState({ showPassword: !showPassword })
  }

  handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  render() {
    const { showPassword } = this.state
    const { classes } = this.props

    return (
      <React.Fragment>
        <Field
          name="userName"
          label="Usuario"
          component={TextFormField}
          classes={{
            root: classes.field,
          }}
          inputProps={{
            className: classes.input,
          }}
          InputLabelProps={{
            className: classes.label,
          }}
          required
        />
        <Field
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Senha"
          component={TextFormField}
          classes={{
            root: classes.field,
          }}
          InputLabelProps={{
            className: classes.label,
          }}
          required
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
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(LoginForm)
