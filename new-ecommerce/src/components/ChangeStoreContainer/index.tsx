import { Box, CircularProgress, Stack, Typography, Button, Link } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useTheme } from 'styled-components'
import { BackArrowIcon } from '../../assets/icons'
import { GoBackButton } from '../Menu/styles'
import { PulsingCircle } from '../PulsingCircle'
import { StoreLinkCard } from './styles'
import { IstoreGroupArray } from  '../../services/store/response.interface'
import AuthContext from '../../contexts/auth.context'


interface ChangeStoreContainerProps {
  storeGroup?: IstoreGroupArray
  onClose: () => void
}

export const ChangeStoreContainer: React.FC<ChangeStoreContainerProps> = ({
  storeGroup, onClose
}) => {
  const { color } = useTheme()
  const [isOpen] = useState(false)

  const { store } = useContext(AuthContext)
  const currentStoreURL = store?.url || null

  return (
    <React.Fragment>
      <GoBackButton onClick={onClose}>
        <Stack direction="row" alignItems="center" spacing={4}>
          <BackArrowIcon color={color.neutral.darkest} height={16} width={16} />
          <Stack alignItems="flex-start">
            <Stack direction="row">
              <Typography fontSize={18}> Trocar de Filial </Typography>
              <Box position="absolute" height="25px" width="25px" right={{ xs: 75, md: 15 }}>
                <PulsingCircle
                  color={isOpen ? color.feedback.approve.medium : color.feedback.error.medium}
                />
              </Box>
            </Stack>
            <Typography color={color.neutral.medium}> Acesse outras lojas da rede </Typography>
          </Stack>
        </Stack>
      </GoBackButton>
      <Stack spacing={1} mb={2}>
      {storeGroup ? (
        <React.Fragment>
            <Stack spacing={2} width="100%" />
              <Stack />
              <Stack spacing={2} width="100%">
              {storeGroup.storeGroup.map((filial , index: React.Key | null | undefined) => {
                  if(currentStoreURL!==filial.url){
                    return (
                        <StoreLinkCard key={index}>
                          <Typography fontWeight={500} color={color.neutral.darkest} fontSize={16}>
                            {filial.name}
                          </Typography>
                          <Typography color={color.neutral.darkest} fontSize={16}>
                            {filial.address}
                          </Typography>
                          <Button
                            sx={{ paddingX: 4 }}
                            LinkComponent={Link}
                            href={`${filial.url.endsWith('/') ? filial.url.concat('produtos?noredirect') : filial.url.concat('/produtos?noredirect')}`}
                            target="_self"
                            variant="contained"
                            color="primary"
                          >
                            Acessar
                          </Button>
                      </StoreLinkCard>
                      )
                    }
                    else return null
                  })}
              </Stack>
        </React.Fragment>
      ) : (
        <Stack direction="row" p={5} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" size={80} />
        </Stack>
      ) }
      </Stack>
    </React.Fragment>
  )
}
