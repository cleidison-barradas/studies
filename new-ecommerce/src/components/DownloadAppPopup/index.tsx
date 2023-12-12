import React, { useMemo, useState } from 'react'
import { isThisDeviceRunningiOS } from '../../helpers/isDeviceIOS'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'
import { PopupContainer, IOSPopupContainer } from './styles'
import IosShareIcon from '@mui/icons-material/IosShare'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import { IconButton, Stack } from '@mui/material'
import { CloseIcon } from '../../assets/icons'
import { useAddToHomescreenPrompt } from "./useAddToHomescreenPrompt"
import { putStoreAppInstall } from '../../services/installation/installation.service'

export interface DownloadAppPopupProps {
  tenant: string
}

export const DownloadAppPopup: React.FC<DownloadAppPopupProps> = ({ tenant }) => {

  const isInstalled = isUsingInstalled()

  const [isOpen, setIsOpen] = useState(true)

  const userAgent = useMemo(()=> navigator.userAgent,[])

  const [prompt, promptToInstall] = useAddToHomescreenPrompt()

  const [isVisible, setVisibleState] = React.useState(false)

  React.useEffect(
    () => {
      if (prompt) {
        setVisibleState(true)
        prompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
          if(tenant && tenant.length>0){
            putStoreAppInstall({userAgent, tenant})
          }
          }
        })
      }
      else if (isThisDeviceRunningiOS()){
        setVisibleState(true)
      }
    },
    [prompt, userAgent, tenant]
  )

  if (!isVisible) {
    return <div />
  }

  return (
    <React.Fragment>

      {isOpen && isThisDeviceRunningiOS() && !isInstalled && userAgent.match(/safari/i) && (
        <IOSPopupContainer>
          <Stack direction="row" spacing={1}>
            <span>
              instale este aplicativo no seu iphone: Clique em{' '}
              <IosShareIcon sx={{ marginBottom: '-2px' }} fontSize={'small'} /> e depois adicione à
              tela de inicio
            </span>
            <IconButton onClick={() => setIsOpen(false)} color="inherit">
              <CloseIcon height={20} width={20} />
            </IconButton>
          </Stack>
        </IOSPopupContainer>
      )}

      {isOpen && !isInstalled && ( /chrome/i.test(navigator.userAgent) || /android/i.test(userAgent) ) && (
        <PopupContainer>
          <Stack direction="row" spacing={1}>
            <span onClick={() => {setIsOpen(false); promptToInstall()}}>
              <div style={{cursor: 'pointer'}}>
              <DownloadForOfflineIcon style={{ cursor: 'pointer' }} onClick={() => {setIsOpen(false); promptToInstall()}} sx={{ marginBottom: '-10px' }} fontSize={'large'} />
              {' '}Clique pra instalar nosso App!
              </div>
            </span>
            <IconButton onClick={() => setIsOpen(false)} color="inherit">
              <CloseIcon height={20} width={20} />
            </IconButton>
          </Stack>
        </PopupContainer>
    )}

    </React.Fragment>
  )
}
