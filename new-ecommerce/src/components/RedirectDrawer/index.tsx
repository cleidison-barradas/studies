import { Stack, SwipeableDrawer } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { RoundCloseIcon } from '../../assets/icons'
import AuthContext from '../../contexts/auth.context'
import { RedirectContent } from '../RedirectContent'
import { CloseBox } from '../RedirectModal/styles'

export const RedirectDrawer: React.FC = () => {
    const { store } = useContext(AuthContext)
    const [storeUrls, setStoreUrls] = useState(false)
    const [storeGroups, setStoreGroups] = useState(false)

    useEffect(() => {
        if(store){
          const { urls, groups } = store

          if((urls && urls.length > 0) && (!groups || (typeof groups.stores !== 'object'))) {
            setStoreUrls(true)
          }

          if((!urls || urls.length <= 0) && (groups && (typeof groups.stores === 'object'))) {
            setStoreGroups(true)
          }
        }
      }, [store])

    const handleClose = () => {
        if(storeUrls) {
            setStoreUrls(false)
        }

        if(storeGroups) {
            setStoreGroups(false)
        }
    }

    const handleOpen = () => {
        if(storeUrls) {
            setStoreUrls(true)
        }

        if(storeGroups) {
            setStoreGroups(true)
        }
    }

    return (
        <SwipeableDrawer sx={{ '& .MuiDrawer-paper': {
            borderRadius: '24px 24px 0 0',
        }}} onOpen={handleOpen} open={storeUrls || storeGroups} onClose={handleClose} anchor={"bottom"}>
            <Stack padding="20px" alignItems='center'>
                <Stack width="100%" alignItems="flex-end">
                    <CloseBox onClick={handleClose}>
                        <p>Fechar</p>
                        <RoundCloseIcon />
                    </CloseBox>
                </Stack>
                {storeUrls ? (
                    <RedirectContent urls={store?.urls} />
                ) : null}

                {storeGroups ? (
                    <RedirectContent groups={store?.groups} />
                ) : null}
            </Stack>
        </SwipeableDrawer>
    )
}
