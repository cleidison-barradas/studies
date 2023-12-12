export interface DeliverySchedule {
  day: number
  start: Date
  end: Date
  interval: {
    active: boolean
    intervalStart: Date
    intervalEnd: Date
  }
}
