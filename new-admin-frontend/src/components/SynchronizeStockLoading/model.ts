export type SynchronizeStockLoadingProps = {
  status: 'fail' | 'none' | 'success' | 'loading'
  progress: number
  onFinish: () => void
}
