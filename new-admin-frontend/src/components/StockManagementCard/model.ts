export type StockManagementChannel = {
  value: boolean
  name: string
  blocked: boolean
  label: string
}

export type StockManagementCardProps = {
  name: string
  active: boolean
  label: string
  channels: StockManagementChannel[]
  onCardToggle: (value: boolean) => void
  onChange: (value: StockManagementChannel[]) => void
}
