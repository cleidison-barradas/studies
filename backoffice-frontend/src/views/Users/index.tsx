import { Box, LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import UsersPaper from '../../components/Papers/UsersPaper'
import { UserConsumer, UserProvider } from '../../context/UserContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class Stores extends Component<Props> {
    render() {
        const { classes, ...props } = this.props
        return (
            <UserProvider>
                <UserConsumer>
                    {({ getUsers, users, fetching, pagination }) => (
                        <React.Fragment>
                            <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                                <LinearProgress />
                            </Box>

                            <UsersPaper
                                users={users}
                                getUsers={getUsers}
                                pagination={pagination}
                                classes={classes}
                                {...props}
                            />
                        </React.Fragment>
                    )}
                </UserConsumer>
            </UserProvider>
        )
    }
}

export default withStyles(styles)(Stores)
