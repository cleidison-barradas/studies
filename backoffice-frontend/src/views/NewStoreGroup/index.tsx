import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import NewStoreGroupPaper from '../../components/Papers/NewStoreGroupPaper'
import { StoreProvider, StoreConsumer } from '../../context/StoreContext'
import { StoreGroupProvider, StoreGroupConsumer } from '../../context/StoreGroupContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class NewStoreGroup extends Component<Props> {
  render () {
    const { classes, ...props } = this.props
    return (
            <React.Fragment>
                <StoreProvider>
                    <StoreConsumer>
                        {({ stores, getStores }) => (
                            <StoreGroupProvider>
                                <StoreGroupConsumer>
                                    {({ storeGroup }) => (
                                        <NewStoreGroupPaper stores={stores} getStores={getStores} {...props} />
                                    )}
                                </StoreGroupConsumer>
                            </StoreGroupProvider>
                        )}
                    </StoreConsumer>
                </StoreProvider>
            </React.Fragment>
    )
  }
}

export default withStyles(styles)(NewStoreGroup)
