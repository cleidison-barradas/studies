import { CircularProgress } from '@material-ui/core'

import { SyncDocks } from '../../../components/SyncDocks'
import { BoardVirtualDocks } from '../../../components/BoardVirtualDocks'
import { BoardVirtualDocksProvider } from '../../../context/BoardVirtualDocks'

import { SyncDocksConsumer, SyncDocksProvider } from '../../../context/SyncDocks'

import { LoadingStyled } from './styles'

export const VirtulStock = () => (
  <BoardVirtualDocksProvider>
    <SyncDocksProvider>
      <SyncDocksConsumer>
        {({ onboarded, integration: { loading } }) =>
          loading ? (
            <LoadingStyled>
              <CircularProgress variant="indeterminate" />
            </LoadingStyled>
          ) : onboarded ? (
            <BoardVirtualDocks />
          ) : (
            <SyncDocks />
          )
        }
      </SyncDocksConsumer>
    </SyncDocksProvider>
  </BoardVirtualDocksProvider>
)
