export default interface IBillboard {
  _id: string
  title: string
  type: 'info' | 'danger' | 'error'
  message: string
  active: boolean
  startAt: Date
  endAt: Date
  createdAt: Date
  updatedAt: Date
}
