import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import StoreGroupsPaper from '../../components/Papers/StoreGroupsPaper'
import { StoreGroupConsumer, StoreGroupProvider } from '../../context/StoreGroupContext'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoreGroups extends Component<Props> {
  render () {
    // const { } = this.props
    return (
            <React.Fragment>
                <StoreGroupProvider>
                    <StoreGroupConsumer>
                        {({ storeGroups, getStoreGroups, fetching, pagination }) => (
                            <StoreGroupsPaper
                                storeGroups={storeGroups}
                                getStoreGroups={getStoreGroups}
                                fetching={fetching}
                                pagination={pagination}
                            />
                        )}
                    </StoreGroupConsumer>
                </StoreGroupProvider>
            </React.Fragment>
    )
  }
}

export default withStyles(styles)(StoreGroups)
