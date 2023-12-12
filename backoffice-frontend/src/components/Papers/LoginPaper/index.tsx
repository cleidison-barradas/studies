import { Paper, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { LoginForm } from '../../Forms'
import styles from './styles'
import mypharmaLogo from '../../../assets/images/logo-mypharma.png'
import { UserSessionRequest } from '../../../services/api/interfaces/ApiRequest'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    requestSession: (credential: UserSessionRequest) => Promise<void>
}

class LoginPaper extends Component<Props> {
    render() {
        const { classes, requestSession } = this.props
        return (
            <Paper className={classNames(classes.paperWrap)}>
                <div className={classes.topBar}>
                    <Link to="/" className={classes.brand}>
                        <img src={mypharmaLogo} alt="MyPharma" />
                    </Link>
                </div>
                <LoginForm requestSession={requestSession} />
            </Paper>
        )
    }
}

export default withStyles(styles)(LoginPaper)
