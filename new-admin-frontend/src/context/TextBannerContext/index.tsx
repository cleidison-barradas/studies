import { createContext } from 'react'

import { BaseContextProvider, BaseContextState } from '../BaseContext'

import Store from '../../interfaces/store'
import STORAGE_KEYS from '../../services/storageKeys'
import { loadStorage } from '../../services/storage'
import { IStorageTenant } from '../../interfaces/storageTenant'
import { updateTextBanner } from '../../services/api'
import Banner from '../../interfaces/banner'

interface TextBannerContextState extends BaseContextState {
  store?: Store
}

interface TextBannerContextData extends TextBannerContextState {
  resetErrors: (...args: any) => void
  updateBanner: (...args: any) => void
}

const TextBannerContext = createContext({} as TextBannerContextData)
export default TextBannerContext

const { Provider, Consumer } = TextBannerContext
export const TextBannerConsumer = Consumer

export class TextBannerProvider extends BaseContextProvider {
  state: TextBannerContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
  }

  async updateBanner(payload: Banner) {
    const store = loadStorage<IStorageTenant>(STORAGE_KEYS.TENANT_KEY)

    if (store) {
      const { ok, data, } = await updateTextBanner(store._id, { banners: [payload] })

      if (ok) return data[0]
    }
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          resetErrors: this.resetErrors,
          updateBanner: this.updateBanner,
        }}
      >
        {children}
      </Provider>
    )
  }
}
