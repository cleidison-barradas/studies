import { LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import Pagination from '../../../interfaces/pagination'
import StoreGroup from '../../../interfaces/storeGroup'
import { GetStoreGroupsRequest } from '../../../services/api/interfaces/ApiRequest'
import PaperBlock from '../../PaperBlock'
import StoreGroupsTable from '../../Tables/StoreGroupsTable'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    storeGroups: StoreGroup[]
    getStoreGroups: (data?: GetStoreGroupsRequest) => Promise<void>
    fetching?: boolean
    pagination?: Pagination
}

class StoreGroupsPaper extends Component<Props> {
  render () {
    const { storeGroups, fetching, getStoreGroups, pagination } = this.props
    return (
            <PaperBlock title="Grupo de lojas">
                {!fetching && <LinearProgress />}
                <StoreGroupsTable storeGroups={storeGroups} getStoreGroups={getStoreGroups} pagination={pagination} />
            </PaperBlock>
    )
  }
}

export default withStyles(styles)(StoreGroupsPaper)
