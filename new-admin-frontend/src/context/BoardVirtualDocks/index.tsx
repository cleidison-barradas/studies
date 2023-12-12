/* eslint-disable react-hooks/exhaustive-deps */
/* tslint:disable */

import { createContext, useEffect, useState } from 'react'

import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { loadStorage } from '../../services/storage'
import storageKeys from '../../services/storageKeys'
import { IStorageAuth } from '../../interfaces/storageAuth'
import {
  activeVirtualDocks,
  disableVirtualDocks,
  getExternalIntegrationData,
  getVirtualDocksNotification,
} from '../../services/api'
import Store from '../../interfaces/store'

export type ChannelDocks = {
  name: string
  label: string
  value: boolean
  blocked: boolean
}

export type VirtualDocks = {
  active: boolean
  channels: ChannelDocks[]
}

export type BoardSynchronize = {
  status: 'fail' | 'none' | 'success' | 'loading'
  loading: boolean
  open: boolean
}

export type VirtualPrevent = {
  active: boolean
  disable: boolean
}

type ContextState = BaseContextState & {
  virtual: VirtualDocks
  synchronize: BoardSynchronize
  countFailedItems: number
  progress: number
  physical: VirtualDocks
  virtualPrevent: VirtualPrevent
}

type ContextData = ContextState & {
  setVirtual: (value: VirtualDocks) => void
  setProgress: (value: number) => void
  onActiveVirtual: () => void
  setVirtualPrevent: (value: VirtualPrevent) => void
  onDisableVirtual: () => void
  setCountFailedItems: (value: number) => void
  setPhysical: (value: VirtualDocks) => void
  setSynchronize: (value: BoardSynchronize) => void
}

export const BoardVirtualDocksContext = createContext({} as ContextData)

const { Provider, Consumer } = BoardVirtualDocksContext
export const BoardVirtualDocksConsumer = Consumer

export const BoardVirtualDocksProvider = ({ children }: BaseContextProvider['props']) => {
  const docks = {
    active: false,
    channels: [
      {
        name: 'ifood',
        value: false,
        blocked: false,
        label: 'iFood',
      },
      {
        name: 'ecommerce',
        value: true,
        blocked: false,
        label: 'Ecommerce',
      },
      {
        blocked: true,
        name: 'pharmaciesApp',
        label: 'FarmáciasApp',
        value: false,
      },
    ],
  }
  const [virtual, setVirtual] = useState<VirtualDocks>(docks)
  const [physical, setPhysical] = useState<VirtualDocks>(docks)
  const [progress, setProgress] = useState(0)
  const [virtualPrevent, setVirtualPrevent] = useState<VirtualPrevent>({
    active: false,
    disable: false,
  })
  const [countFailedItems, setCountFailedItems] = useState(0)

  const [synchronize, setSynchronize] = useState<BoardSynchronize>({ loading: true, status: 'none', open: false })

  useEffect(() => {
    setProgress(0)
  }, [synchronize.open])

  useEffect(() => {
    const auth = loadStorage<IStorageAuth>(storageKeys.AUTH_KEY)

    auth && getPhysicalChannels(auth.store, physical)
    onLoadStatusVirtual()
    onLoadNotification()
  }, [])

  const onLoadStatusVirtual = async () => {
    const { data, status } = await getExternalIntegrationData('DOCAS')

    if (data && status === 200) setVirtual({ ...virtual, active: !!data?.active })
  }

  const getPhysicalChannels = ({ settings }: Store, { channels, ...virtual }: VirtualDocks) => {
    if (settings?.config_ifood_client_secret && settings?.config_ifood_client_secret && settings?.config_ifood_store_id) {
      setPhysical({
        ...virtual,
        channels: channels.map((channel) => (channel.name === 'ifood' ? { ...channel, value: true } : channel)),
      })
    }

    if (settings?.config_farmaciasapp_integrationStatus === 'integrated')
      setPhysical({
        ...virtual,
        channels: channels.map((channel) => (channel.name === 'pharmaciesApp' ? { ...channel, value: true } : channel)),
      })
  }

  const onActiveVirtual = async () => {
    const auth = loadStorage<IStorageAuth>(storageKeys.AUTH_KEY)

    if (auth) {
      const {
        store: { settings, tenant },
      } = auth

      setSynchronize({ loading: true, open: true, status: 'loading' })

      try {
        const { data, status } = await activeVirtualDocks(`${settings.config_cnpj}`, tenant)

        if (data && status === 201) {
          await new Promise((resolve) =>
            setInterval(
              () =>
                setProgress((value) => {
                  if (value > 100) {
                    resolve(true)

                    return value
                  }

                  return value + 30
                }),
              300
            )
          )

          setSynchronize({ ...synchronize, status: 'success', open: true })
        }
      } catch (error) {
        setProgress(100)
        setVirtual({ ...virtual, active: false })
        setSynchronize({ ...synchronize, open: true, status: 'fail' })
      }
    }
  }

  const onLoadNotification = async () => {
    const { status, data } = await getVirtualDocksNotification()

    if (status === 200 && data) return setCountFailedItems(data?.items || 0)

    setCountFailedItems(0)
  }

  const onDisableVirtual = async () => {
    const auth = loadStorage<IStorageAuth>(storageKeys.AUTH_KEY)

    if (auth) {
      const {
        store: { tenant },
      } = auth

      try {
        await disableVirtualDocks(tenant)
      } catch (error) {
        setVirtual({ ...virtual, active: true })
      }
    }
  }

  return (
    <Provider
      value={{
        virtual,
        physical,
        synchronize,
        progress,
        virtualPrevent,
        countFailedItems,
        setProgress,
        onActiveVirtual,
        onDisableVirtual,
        setVirtualPrevent,
        setCountFailedItems,
        setSynchronize,
        setVirtual,
        setPhysical,
      }}
    >
      {children}
    </Provider>
  )
}
