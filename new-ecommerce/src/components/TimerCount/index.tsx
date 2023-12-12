import { Stack, Box } from '@mui/material'
import React from 'react'
import { Timer, TimerContainer, TimerText } from './styles'
import { intervalToDuration } from 'date-fns'

interface TimerProps {
  time: Date
}

export const TimerCount: React.FC<TimerProps> = ({ time }) => {
  return (
    <TimerContainer>
      <Box minWidth="40px">
        <Stack alignItems="center" justifyContent="space-around">
          <Timer>
            {
              intervalToDuration({
                end: new Date(time),
                start: new Date(),
              }).hours
            }
          </Timer>
          <TimerText>Horas</TimerText>
        </Stack>
      </Box>
      <TimerText>:</TimerText>
      <Box minWidth="50px">
        <Stack alignItems="center" justifyContent="space-around">
          <Timer>
            {
              intervalToDuration({
                end: new Date(time),
                start: new Date(),
              }).minutes
            }
          </Timer>
          <TimerText>Minutos</TimerText>
        </Stack>
      </Box>
      <TimerText>:</TimerText>
      <Box minWidth="50px">
        <Stack alignItems="center" justifyContent="space-around">
          <Timer>
            {
              intervalToDuration({
                end: new Date(time),
                start: new Date(),
              }).seconds
            }
          </Timer>
          <TimerText>Segundos</TimerText>
        </Stack>
      </Box>
    </TimerContainer>
  )
}
