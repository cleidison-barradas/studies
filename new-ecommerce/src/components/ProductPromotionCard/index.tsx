import { Typography, Stack } from '@mui/material'
import { intervalToDuration } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { ClockIcon } from '../../assets/icons'
import { PromotionCard, Timer } from './styles'

interface ProductPromotionCardProps {
  date_end: Date
}

export const ProductPromotionCard: React.FC<ProductPromotionCardProps> = ({ date_end }) => {
  const [now, setNow] = useState(new Date())
  const { color } = useTheme()

  useEffect(() => {
    setTimeout(() => setNow(new Date()), 1000)
  }, [now])

  return (
    <PromotionCard>
      <Stack gap={1} justifyContent="space-between" direction="row">
        <Stack gap={1} alignItems="center" justifyContent="space-betwen">
          <Timer>
            {
              intervalToDuration({
                end: new Date(date_end),
                start: new Date(),
              }).hours
            }
          </Timer>
          <Typography fontSize={{ xs: 14, md: 9 }} variant="subtitle1">
            Horas
          </Typography>
        </Stack>
        <Typography mt={1} textAlign={'center'} fontSize={16} fontWeight={700}>
          :
        </Typography>
        <Stack gap={1} alignItems="center" justifyContent="space-betwen">
          <Timer>
            {
              intervalToDuration({
                end: new Date(date_end),
                start: new Date(),
              }).minutes
            }
          </Timer>
          <Typography fontSize={{ xs: 14, md: 9 }} variant="subtitle1">
            Minutos
          </Typography>
        </Stack>
        <Typography mt={1} textAlign={'center'} fontSize={16} fontWeight={700}>
          :
        </Typography>
        <Stack gap={1} alignItems="center" justifyContent="space-betwen">
          <Timer>
            {
              intervalToDuration({
                end: new Date(date_end),
                start: new Date(),
              }).seconds
            }
          </Timer>
          <Typography fontSize={{ xs: 14, md: 9 }} variant="subtitle1">
            Segundos
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={0.5}>
        <ClockIcon color={color.neutral.darkest} />
        <Typography maxWidth={218} textAlign={'center'} fontSize={16} fontWeight={400}>
          Oferta disponível por tempo limitado!
        </Typography>
      </Stack>
    </PromotionCard>
  )
}
