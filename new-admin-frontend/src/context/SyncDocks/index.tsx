/* tslint:disable */

import { createContext, useEffect, useState } from 'react'

import { BaseContextProvider } from '../BaseContext'

import { ActiveDocksProcessStatus } from '../../components/ActiveDocksProcess/model'
import { Checkpoint, ContextData, StatusList, DocksIntegration, Synchronize } from './model'

import { activeVirtualDocks, getExternalIntegrationData, getStatusVirtualDocks } from '../../services/api'
import { loadStorage } from '../../services/storage'

import storageKeys from '../../services/storageKeys'
import { IStorageAuth } from '../../interfaces/storageAuth'

export const SyncDocksContext = createContext({} as ContextData)

const { Provider, Consumer } = SyncDocksContext
export const SyncDocksConsumer = Consumer

export const SyncDocksProvider = ({ children }: BaseContextProvider['props']) => {
  const [step, setStep] = useState(0)
  const [isClient, setIsClient] = useState(true)
  const [integration, setIntegration] = useState<DocksIntegration>({ loading: true })
  const [loading, setLoading] = useState(false)
  const [reasons, setReasons] = useState<string[]>([])
  const [onboarded, setOnboarded] = useState(false)
  const [status, setStatus] = useState<ActiveDocksProcessStatus>('none')
  const [checkpoint, setCheckpoint] = useState<Checkpoint>({
    next: false,
    back: false,
    onNext: () => {},
    onBack: () => {},
    label: 'primeira',
  })

  const [synchronize, setSynchronize] = useState<Synchronize>({
    loading: false,
    stocks: ['physical', 'virtual'],
    value: false,
    status: 'success',
  })
  const [progress, setProgress] = useState(0)

  const [stepBenefit, setStepBenefit] = useState(0)

  const onFitScreenLayout = () => {
    const screen = document.querySelector('#mainContent :nth-child(1)') as HTMLElement

    screen && (screen.style.height = '100%')
  }

  useEffect(() => {
    onFitScreenLayout()
    onGetIntegrationStore()
  }, [])

  const onGetIntegrationStore = async () => {
    setIntegration({ loading: true })
    const { data, status } = await getExternalIntegrationData('DOCAS')

    setTimeout(() => {
      setIntegration({ loading: false })

      if (status === 200 && data.externalIntegrationData) setOnboarded(true)
    }, 1000)
  }

  useEffect(() => {
    if (synchronize.loading) {
      const timer = setInterval(() => setProgress((value) => (value >= 100 ? 100 : value + 10)), 800)

      return () => clearInterval(timer)
    }

    setProgress(0)
  }, [synchronize.loading])

  const onSyncVirtualDocks = async () => {
    setSynchronize({ ...synchronize, value: true, loading: true })

    const auth = onGetStore()

    if (auth) {
      const {
        store: { tenant, settings },
      } = auth

      try {
        const { data, status } = await activeVirtualDocks(`${settings.config_cnpj}`, tenant)

        setProgress(100)
        if (data && status === 201) return setSynchronize({ ...synchronize, loading: true, status: 'success' })

        throw new Error()
      } catch (error) {
        setProgress(100)
        setSynchronize({ ...synchronize, loading: true, status: 'fail' })
      }
    }
  }

  const onGetStore = () => loadStorage<IStorageAuth>(storageKeys.AUTH_KEY)

  const onGetStatusVirtualDocks = async () => {
    setLoading(true)
    const { data, ...res } = await getStatusVirtualDocks()
    setLoading(false)

    if (res.status === 200 && data) {
      if (data.enabled) return setStatus('success')

      const status: StatusList = { ASSESSING: 'loading', ACTIVE: 'success', REQUESTED: 'loading' }

      setReasons(data.reason || [])
      setStatus(status[data.status] as ActiveDocksProcessStatus)

      return
    }

    setStatus('error')
  }

  return (
    <Provider
      value={{
        step,
        isClient,
        status,
        checkpoint,
        reasons,
        progress,
        stepBenefit,
        integration,
        setIntegration,
        onboarded,
        setOnboarded,
        loading,
        onGetStatusVirtualDocks,
        onSyncVirtualDocks,
        synchronize,
        setCheckpoint,
        setSynchronize,
        setLoading,
        setStepBenefit,
        setStatus,
        setStep,
        setIsClient,
      }}
    >
      {children}
    </Provider>
  )
}
