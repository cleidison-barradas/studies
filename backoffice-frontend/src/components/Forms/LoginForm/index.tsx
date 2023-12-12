import React, { Component } from 'react'
import { TextField, IconButton, InputAdornment, CircularProgress, Box } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import { Field, Form, Formik } from 'formik'
import { UserSessionRequest } from '../../../services/api/interfaces/ApiRequest'
import * as yup from 'yup'

interface LoginProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
    requestSession: (credential: UserSessionRequest) => Promise<void>
}

const validationSchema = yup.object({
    userName: yup.string().required('O usuário é um campo obrigatório!'),
    password: yup.string().required('A senha é um campo obrigatório!'),
})

class LoginForm extends Component<LoginProps> {
    state = {
        showPassword: false,
    }

    handleClickShowPassword = () => {
        const { showPassword } = this.state
        this.setState({ showPassword: !showPassword })
    }

    handleMouseDownPassword = (event: React.MouseEvent) => {
        event.preventDefault()
    }

    render() {
        const { classes, requestSession } = this.props
        const { showPassword } = this.state

        return (
            <Formik
                initialValues={{
                    userName: '',
                    password: '',
                }}
                onSubmit={requestSession}
                validationSchema={validationSchema}
            >
                {({ isSubmitting, errors, isValid, touched, values, initialValues }) => (
                    <Form className={classes.formWrap} autoComplete="off">
                        <Box flex="1">
                            <Field
                                name="userName"
                                as={TextField}
                                label="Usuario"
                                fullWidth
                                classes={{
                                    root: classes.input,
                                }}
                                InputLabelProps={{
                                    className: classes.label,
                                }}
                                helperText={touched.userName && errors.userName}
                                error={!!errors.userName && touched.userName}
                            />
                            <Box mt={3}>
                                <Field
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    as={TextField}
                                    classes={{
                                        root: classes.input,
                                    }}
                                    helperText={touched.password && errors.password}
                                    error={!!errors.password && touched.password}
                                    InputLabelProps={{
                                        className: classes.label,
                                    }}
                                    InputProps={{
                                        className: classes.input,
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
                                    fullWidth
                                    label="Senha"
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                type="submit"
                                fullWidth
                                disabled={isSubmitting || !isValid || initialValues === values}
                            >
                                {isSubmitting ? <CircularProgress size={20} color="secondary" /> : 'Login'}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default withStyles(styles)(LoginForm)
