import { getHours, getMinutes, isDate } from 'date-fns'
import { DeliverySchedule } from '../interfaces/deliverySchedule'
import Region from '../interfaces/regions'
import { formatNumberToTwoDigits, minutesToTime } from './dataConversion'
import { Typography } from '@mui/material'
import { Fragment } from 'react'
import DistanceDeliveryFee from '../interfaces/distanceDeliveryFee'

function isWithinInterval(date: Date, intervals: { start: Date | null; end: Date | null }[]) {
  const testDate = new Date()
  testDate.setHours(date.getHours())
  testDate.setMinutes(date.getMinutes())

  for (const interval of intervals) {
    if (interval.start === null || interval.end === null) continue
    const testIntervalStart = new Date()
    testIntervalStart.setHours(interval.start.getHours())
    testIntervalStart.setMinutes(interval.start.getMinutes())

    const testIntervalEnd = new Date()
    testIntervalEnd.setHours(interval.end.getHours())
    testIntervalEnd.setMinutes(interval.end.getMinutes())

    if (
      date.getTime() >= testIntervalStart.getTime() &&
      date.getTime() <= testIntervalEnd.getTime()
    )
      return true
  }
  return false
}

function isBeforeDate(date: Date, dateToCompare: Date) {
  if (isDate(date) === false || isDate(dateToCompare) === false) return false
  const testDate = new Date()
  testDate.setHours(date.getHours())
  testDate.setMinutes(date.getMinutes())
  const testDateToCompare = new Date()
  testDateToCompare.setHours(dateToCompare.getHours())
  testDateToCompare.setMinutes(dateToCompare.getMinutes())

  return testDate.getTime() < testDateToCompare.getTime()
}

/**
 * Retorna o texto de previsão de entrega com base na escala de horários e na região do usuário
 *
 * @param schedules Escala de horários de entrega
 * @param region Região do usuário
 * @returns Texto de previsão de entrega
 */
export const renderDeliveryTimeText = ({
  schedules,
  region,
}: {
  schedules?: DeliverySchedule[] | null
  region?: Region | DistanceDeliveryFee  | null
}) => {
  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado']
  const currentDaySchedule = schedules?.find((schedule) => schedule.day === new Date().getDay())

  if (schedules?.length === 0)
    return (
      <Fragment>
        <Typography variant="body2" noWrap fontSize={14} color="primary">
          Não há horários de entrega
        </Typography>
        <Typography variant="body2" noWrap fontSize={14} color="primary">
          disponíveis
        </Typography>
      </Fragment>
    )

  const currentDay = new Date().getDay()

  const finishedCurrentDaySchedule = currentDaySchedule
    ? !isBeforeDate(
        new Date(),
        currentDaySchedule?.interval && currentDaySchedule?.interval.active
          ? new Date(currentDaySchedule.interval.intervalEnd)
          : new Date(currentDaySchedule?.end)
      )
    : true

  // Se o dia atual está na escala de horários de entrega, foi fornecido uma previsão de entrega para a região do
  // usuário e o horário de entrega ainda não acabou
  if (currentDaySchedule && region && !finishedCurrentDaySchedule) {
    const start = currentDaySchedule ? new Date(currentDaySchedule.start) : null
    const end = currentDaySchedule ? new Date(currentDaySchedule.end) : null
    const intervalStart =
      currentDaySchedule && currentDaySchedule.interval
        ? new Date(currentDaySchedule.interval.intervalStart)
        : null
    const intervalEnd =
      currentDaySchedule && currentDaySchedule.interval
        ? new Date(currentDaySchedule.interval.intervalEnd)
        : null

    const now = new Date()
    let isWithin = false

    if (start != null && end != null) {
      isWithin = isWithinInterval(now, [
        { start, end },
        { start: intervalStart, end: intervalEnd as Date },
      ])
    }

    if (isWithin) {
      return `${minutesToTime(region?.deliveryTime).value} ${
        minutesToTime(region?.deliveryTime).suffix
      }`
    }

    if (isBeforeDate(now, start as Date)) {
      return `Hoje a partir das ${formatNumberToTwoDigits(getHours(start as Date))}:${
        minutesToTime(getMinutes(start as Date)).value
      }`
    }
    return `Hoje a partir das ${formatNumberToTwoDigits(getHours(intervalStart as Date))}:${
      minutesToTime(getMinutes(intervalStart as Date)).value
    }`
  }

  const actualDay = new Date().getDay()
  let daySchedule = actualDay + 1
  let nextDaySchedule = null
  let limitFind = 15

  // Se não existem horários de entrega ainda para o dia atual, busca o proximo dia com
  // horários cadastrados na lista de escalas
  /* eslint-disable*/
  while (!nextDaySchedule) {
    if (!limitFind) break
    limitFind--
    const scheduleDay = schedules?.find(
      (schedule) => schedule.day === daySchedule && schedule.day !== actualDay
    )
    if (scheduleDay) nextDaySchedule = scheduleDay
    else daySchedule = (daySchedule + 1) % 8
  }
  /* eslint-enable*/
  const scheduleStart = new Date(nextDaySchedule?.start as Date)

  if (daySchedule === currentDay + 1 || (daySchedule === 0 && currentDay === 7))
    return `Amanhã a partir das ${formatNumberToTwoDigits(getHours(scheduleStart))}:${
      minutesToTime(getMinutes(scheduleStart)).value
    }`

  return `${weekDays[daySchedule % 7]} a partir das ${formatNumberToTwoDigits(
    getHours(scheduleStart)
  )}:${minutesToTime(getMinutes(scheduleStart)).value}`
}
