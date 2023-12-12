import { createContext, useEffect, useState } from 'react'

import { BaseContextProvider, BaseContextState } from '../BaseContext'
import { StorageDialog } from '../../interfaces/storage'
import { loadStorage, saveStorage } from '../../services/storage'
import storageKeys from '../../services/storageKeys'

type ContextState = BaseContextState & {
  open: boolean
}

type ContextData = ContextState & {
  onToggle: (open: boolean) => void
}

const StartDocksContext = createContext({} as ContextData)

const { Provider, Consumer } = StartDocksContext
export const StartDocksConsumer = Consumer

export const StartDocksProvider = ({ children }: BaseContextProvider['props']) => {
  const [open, setOpen] = useState(false)

  const setStorageDialog = (value: boolean) => {
    const dialog = loadStorage<StorageDialog>(storageKeys.DIALOG)

    if (dialog) return saveStorage<StorageDialog>(storageKeys.DIALOG, { ...dialog, docas: value })

    saveStorage<StorageDialog>(storageKeys.DIALOG, { docas: false })
  }

  const getStorageDialog = () => loadStorage<StorageDialog>(storageKeys.DIALOG) || { docas: false }

  useEffect(() => {
    setOpen(getStorageDialog().docas)
  }, [])

  const onToggle = (value: boolean) => {
    setStorageDialog(value)
    setOpen(value)
  }

  return <Provider value={{ open, onToggle: (value) => onToggle(value) }}>{children}</Provider>
}
