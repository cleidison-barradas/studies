import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { format, getHours, getMinutes, isWithinInterval, setMinutes, setHours } from 'date-fns'
import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import useSWR from 'swr'
import { BackArrowIcon } from '../../assets/icons'
import { getDeliverySchedule } from '../../services/delivery/delivery.service'
import { GoBackButton } from '../Menu/styles'
import { PulsingCircle } from '../PulsingCircle'

interface DeliveryScheduleContainerProps {
  onClose: () => void
}

export const DeliveryScheduleContainer: React.FC<DeliveryScheduleContainerProps> = ({
  onClose,
}) => {
  const {
    data: deliveryScheduleRequest,
    isValidating,
    error,
  } = useSWR('deliverySchedule', getDeliverySchedule, { revalidateOnFocus: false })
  const { color } = useTheme()
  const [isOpen, setisOpen] = useState(false)

  const WEEKDAY: any = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sabado',
    'Domingo',
    'Feriados',
  ]

  return (
    <React.Fragment>
      <GoBackButton onClick={onClose}>
        <Stack direction="row" alignItems="center" spacing={4}>
          <BackArrowIcon color={color.neutral.darkest} height={16} width={16} />
          <Stack alignItems="flex-start">
            <Stack direction="row">
              <Typography fontSize={18}> Horários de Entrega </Typography>
              <Box position="absolute" height="25px" width="25px" right={{ xs: 75, md: 15 }}>
                <PulsingCircle
                  color={isOpen ? color.feedback.approve.medium : color.feedback.error.medium}
                />
              </Box>
            </Stack>
            <Typography color={color.neutral.medium}> Para delivery local </Typography>
          </Stack>
        </Stack>
      </GoBackButton>
      <Stack spacing={1} mb={2}>
        {!isValidating && !error ? (
          deliveryScheduleRequest?.data?.schedule.map((schedule) => {
            const { day } = schedule
            const start = new Date(schedule.start)
            const end = new Date(schedule.end)

            const startMinutes = getMinutes(start)
            const startHour = getHours(start)

            const endMinutes = getMinutes(end)
            const endHour = getHours(end)

            const startTime = setMinutes(setHours(new Date(), startHour), startMinutes)
            const endTime = setMinutes(setHours(new Date(), endHour), endMinutes)

            const today = Number(format(new Date(), 'i'))

            const intervalStart = new Date(schedule.interval.intervalStart)
            const intervalEnd = new Date(schedule.interval.intervalEnd)

            if (
              isOpen === false &&
              day === today &&
              isWithinInterval(new Date(), { start: startTime, end: endTime })
            ) {
              setisOpen(true)
            }

            return (
              <Stack key={day} direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontSize={18}> {WEEKDAY[day - 1]} </Typography>
                <Typography fontSize={15} fontFamily="Montserrat" color={color.neutral.medium}>
                  <Box>
                    {`das ${getHours(start)}:${getMinutes(start)}`}h às
                    {` ${getHours(end)}:${getMinutes(end)}`}h
                  </Box>
                  <Box>
                    {schedule.interval.active ? (
                      <>
                        {` e das ${getHours(intervalStart)}:${getMinutes(intervalStart)}`}h às
                        {` ${getHours(intervalEnd)}:${getMinutes(intervalEnd)}`}h
                      </>
                    ) : null}
                  </Box>
                </Typography>
              </Stack>
            )
          })
        ) : (
          <Stack direction="row" p={5} justifyContent="center" alignItems="center">
            <CircularProgress color="primary" size={80} />
          </Stack>
        )}
        <Divider />
        <Typography color={color.neutral.medium} mt={2}>
          <strong>OBS</strong>: pedidos feitos fora do horário de entrega serão entregues no próximo
          dia de entrega, conforme lista acima.
        </Typography>
      </Stack>
    </React.Fragment>
  )
}
