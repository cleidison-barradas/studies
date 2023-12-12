export type ActiveDocksProcessStatus = 'loading' | 'error' | 'success' | 'none'
export type ActiveDocksProcessProps = {
  status: ActiveDocksProcessStatus
  reasons: string[]
  onRequestActive: () => void
  onSync: () => void
}
