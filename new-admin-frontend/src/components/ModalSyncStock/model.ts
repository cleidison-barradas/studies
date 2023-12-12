export type ModalSyncStockProps = {
  open: boolean
  onChange: (value: boolean) => void
  loading: boolean
  progress: number
  onFinish: () => void
  onSyncronize: () => void
  status: 'fail' | 'none' | 'success' | 'loading'
}
