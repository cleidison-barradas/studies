import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import StoreGroupPaper from '../../components/Papers/StoreGroupPaper'
import { StoreConsumer, StoreProvider } from '../../context/StoreContext'
import { StoreGroupConsumer, StoreGroupProvider } from '../../context/StoreGroupContext'
import styles from './styles'

interface Props extends RouteComponentProps {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoreGroup extends Component<Props> {
  render () {
    return (
            <React.Fragment>
                <StoreProvider>
                    <StoreConsumer>
                        {({ stores, getStores }) => (
                            <StoreGroupProvider>
                                <StoreGroupConsumer>
                                    {({ storeGroup }) => (
                                        <StoreGroupPaper
                                            storeGroup={storeGroup}
                                            stores={stores}
                                            getStores={getStores}
                                        />
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

export default withStyles(styles)(StoreGroup)
