export type ModalToggleStockProps = {
  variant: 'default' | 'warning'
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  onChange: (value: boolean) => void
  icon: string
  description: string
  name: string
  confirmAction: string
  cancelAction: string
}
