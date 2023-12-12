import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import StoreBranchPaper from '../../components/Papers/StoreBranchPaper'
import StoreBranchPickupPaper from '../../components/Papers/StoreBranchPickup'
import StoreGroupsPaper from '../../components/Papers/StoreGroupsPaper'
import { ConfirmDialogConsumer, ConfirmDialogProvider } from '../../context/ConfirmDialogContext'
import { SnackbarConsumer } from '../../context/SnackbarContext'
import { StoreBranchPickupConsumer, StoreBranchPickupProvider } from '../../context/StoreBranchPickupContext'
import { StoreProvider, StoreConsumer } from '../../context/StoreContext'
import customerxService from '../../services/customerx.service'
import styles from './styles'

interface Props extends RouteComponentProps {
  mode: any
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoreBranchView extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    return (
      <StoreProvider>
        <StoreConsumer>
          {({
            requestGetStoreGroups,
            requestGetStoreList,
            requestGetStoreUrls,
            requestAlterStoreUrls,
            requestAddStoreGroup,
            requestDeleteStoreGroup,
            groups,
            stores,
            store,
            storeUrls,
            success,
          }) => (
            <SnackbarConsumer>
              {({ openSnackbar }) => (
                <React.Fragment>
                  <StoreBranchPaper
                    {...this.props}
                    onSuccess={success}
                    storeUrls={storeUrls}
                    available={groups && groups.length <= 0}
                    mainStore={store?.mainStore}
                    openSnackbar={openSnackbar}
                    onEdit={requestAlterStoreUrls}
                    loadStoreUrls={requestGetStoreUrls}
                  />

                  <StoreGroupsPaper
                    {...this.props}
                    stores={stores}
                    groups={groups}
                    available={storeUrls && storeUrls.length <= 0}
                    onSuccess={success}
                    mainStore={store?.mainStore}
                    openSnackbar={openSnackbar}
                    onSave={requestAddStoreGroup}
                    onDelete={requestDeleteStoreGroup}
                    loadStoreList={requestGetStoreList}
                    loadStoreGroups={requestGetStoreGroups}
                  />
                  <ConfirmDialogProvider>
                    <ConfirmDialogConsumer>
                      {({ openDialog, closeDialog }) => (
                        <StoreBranchPickupProvider>
                          <StoreBranchPickupConsumer>
                            {({
                              storeBranches,
                              success,
                              requestgetStoreBranchesPickup,
                              requestaddStoreBranchPickup,
                              requestdeleteStoreBranchPickup,
                            }) => (
                              <StoreBranchPickupPaper
                                onSuccess={success}
                                items={storeBranches}
                                available={groups && groups.length <= 0}
                                mainStore={store?.mainStore}
                                openSnackbar={openSnackbar}
                                onEdit={requestaddStoreBranchPickup}
                                loadStoreBranches={requestgetStoreBranchesPickup}
                                onDelete={requestdeleteStoreBranchPickup}
                                openDialog={openDialog}
                                closeDialog={closeDialog}
                              />
                            )}
                          </StoreBranchPickupConsumer>
                        </StoreBranchPickupProvider>
                      )}
                    </ConfirmDialogConsumer>
                  </ConfirmDialogProvider>
                </React.Fragment>
              )}
            </SnackbarConsumer>
          )}
        </StoreConsumer>
      </StoreProvider>
    )
  }
}

export default withStyles(styles)(StoreBranchView)
