import { ActiveDocksProcessStatus } from '../../components/ActiveDocksProcess/model'
import { BaseContextState } from '../BaseContext'

export type Checkpoint = {
  onNext: () => void
  next: boolean
  onBack: () => void
  back: boolean
  label: string
}

export type Stock = 'virtual' | 'physical'

export type StockStatus = 'fail' | 'none' | 'success' | 'loading'

export type Synchronize = {
  loading: boolean
  stocks: Stock[]
  status: StockStatus
  value: boolean
}

export type DocksIntegration = {
  loading: boolean
}

export type StatusList = { [key: string]: string }

export type ContextState = BaseContextState & {
  step: number
  status: ActiveDocksProcessStatus
  isClient: boolean
  loading: boolean
  checkpoint: Checkpoint
  progress: number
  stepBenefit: number
  synchronize: Synchronize
  reasons: string[]
  integration: DocksIntegration
  onboarded: boolean
}

export type ContextData = ContextState & {
  setStep: (value: number) => void
  setLoading: (value: boolean) => void
  setCheckpoint: (value: Checkpoint) => void
  setStepBenefit: (value: number) => void
  setSynchronize: (value: Synchronize) => void
  onSyncVirtualDocks: () => void
  onGetStatusVirtualDocks: () => void
  setOnboarded: (value: boolean) => void
  setIsClient: (value: boolean) => void
  setIntegration: (value: DocksIntegration) => void
  setStatus: (value: ActiveDocksProcessStatus) => void
}
