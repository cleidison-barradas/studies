import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import LoginPaper from '../../components/Papers/LoginPaper'
import styles from './styles'
import { AuthConsumer } from '../../context/AuthContext'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class Login extends Component<Props> {
    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <div className={classes.container}>
                    <div className={classes.userFormWrap}>
                        <AuthConsumer>
                            {({ requestSession }) => <LoginPaper requestSession={requestSession} />}
                        </AuthConsumer>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Login)
