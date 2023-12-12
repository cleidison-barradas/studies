import { Box, Hidden, Stack, Tooltip, Typography } from '@mui/material'
import { isBefore } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { BackArrowIcon, ClockIcon, SafeIcon } from '../../assets/icons'
import { ReturnButton } from '../ReturnButton'
import { TimerCount } from '../TimerCount'
import { HeaderContainer, SafeBuyTag, TimerContainer, InnerHeader } from './styles'

export const HeaderCheckout: React.FC = () => {
  const [now, setNow] = useState(new Date())
  const navigate = useNavigate()

  const [limit] = useState(new Date(new Date().getTime() + 1000 * 60 * 10))

  useEffect(() => {
    const timer = setTimeout(() => setNow(new Date()), 1000)
    return () => clearTimeout(timer)
  }, [now])

  return (
    <HeaderContainer>
      <SafeBuyTag>
        <Box display="flex" gap={3} justifyContent="center" alignItems="center">
          Compra Segura
          <SafeIcon />
          100% Protegido
        </Box>
      </SafeBuyTag>
      <Hidden smUp>
        <TimerContainer>
          <ReturnButton onClick={() => navigate('/produtos')}>
            <BackArrowIcon />
          </ReturnButton>
          <TimerCount time={limit} />
          <Typography alignItems="center" display="flex" gap={1} variant="subtitle1">
            <ClockIcon /> Finalize o pedido!
          </Typography>
        </TimerContainer>
      </Hidden>
      <Hidden smDown>
        {isBefore(limit, now) ? (
          <React.Fragment />
        ) : (
          <InnerHeader>
            <Stack direction="row" gap={3} justifyContent="center" alignItems="center">
              <Stack direction="row" alignItems="center">
                <TimerCount time={limit} />
                <Tooltip title="Finalize rapidamente seu pedido para garantir que estoque e preço dos seus produtos não sofram variação">
                  <Typography alignItems="center" display="flex" gap={1} variant="subtitle1">
                    <ClockIcon /> Finalize seu pedido!
                  </Typography>
                </Tooltip>
              </Stack>
            </Stack>
          </InnerHeader>
        )}
      </Hidden>
    </HeaderContainer>
  )
}
