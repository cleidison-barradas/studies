export default interface DeliverySchedule {
    _id?: string
    weekDay: string
    start: Date
    end: Date
    interval: {
        active?: boolean
        intervalStart?: Date
        intervalEnd?: Date
    }
}
