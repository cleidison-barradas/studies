import React, { createContext } from 'react'
import { BaseApi } from '../../config'
import Banner from '../../interfaces/banner'
import Store from '../../interfaces/store'
import { getLayout, postLayout } from '../../services/api'
import { loadStorage } from '../../services/storage'
import { BaseContextProvider, BaseContextState } from '../BaseContext'
import STORAGE_KEYS from '../../services/storageKeys'
import { IStorageTenant } from '../../interfaces/storageTenant'

interface LayoutContextState extends BaseContextState {
  banners: Banner[]
  store?: Store
}

export type TextBannerModel = {
  url?: string
  title?: string
  description?: string
}

interface LayoutContextData extends LayoutContextState {
  resetErrors: (...args: any) => void
  getLayout: (...arg: any) => void
  postLayout: (...args: any) => any
}

const LayoutContext = createContext({} as LayoutContextData)
export default LayoutContext

const { Provider, Consumer } = LayoutContext
export const LayoutConsumer = Consumer

export class LayoutProvider extends BaseContextProvider {
  state: LayoutContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    banners: [],
  }

  onGetTextBanners = (data: Banner[], size = 5) => {
    const urls: TextBannerModel[] = [
      { title: 'Frete grátis', description: 'em todos os produtos', url: 'banner_institutional@x1.png' },
      {
        title: 'A farmácia mais próxima de você é a Hyper Pharma',
        description: 'Como chegar na farmácia Hyper Pharma em Caçador - SC ?',
        url: 'banner_institutional@x2.png',
      },
      {
        title: '50% des desconto',
        description: 'em produtos selecionados de toda linha de medicamentos',
        url: 'banner_institutional@x3.png',
      },
      {
        title: '50% des desconto',
        description: 'em produtos selecionados de toda linha de perfumaria',
        url: 'banner_institutional@x4.png',
      },
      {
        title: '50% des desconto',
        description: 'em produtos selecionados de toda linha de vitaminas',
        url: 'banner_institutional@x5.png',
      },
    ]

    const newTextBanner = (banner: Banner, textBanner: TextBannerModel) =>
      ({
        ...banner,
        image: {
          ...(banner?.image || {}),
          url: textBanner.url,
        },
        placeholders: {
          title: textBanner.title,
          description: textBanner.description,
        },
      } as Banner)

    const savedBanners = data.map(({ image, ...banner }) => {
      const item = urls.find(({ url }) => image?.url === url)

      return newTextBanner(banner, { ...(item || {}), url: image?.url })
    })

    const defaultBanners = urls
      .filter(({ url }) => !savedBanners.find((banner) => banner.image?.url === url))
      .map((image) => newTextBanner({}, image))

    return [...savedBanners, ...defaultBanners]
  }

  getLayout = async () => {
    this.startRequest(BaseApi)
    const store = loadStorage<IStorageTenant>(STORAGE_KEYS.TENANT_KEY)

    if (store) {
      const response = await getLayout(store._id)
      const {
        data: { banners, ...data },
      } = response
      const isInstitutional = data.store?.plan?.rule === 'institutional'

      const payload = { ...response, data: { ...data, banners: isInstitutional ? this.onGetTextBanners(banners) : banners } }

      this.processResponse(payload, ['banners', 'store'])
    }
  }

  postLayout = async (images: any) => {
    this.startRequest(BaseApi)
    const store = loadStorage<IStorageTenant>(STORAGE_KEYS.TENANT_KEY)

    if (store) {
      const response = await postLayout(store._id, images)
      const {
        data: { banners, ...data },
      } = response
      const isInstitutional = data.store?.plan?.rule === 'institutional'

      if (!isInstitutional) {
        this.processResponse(response, ['banners', 'store'])
      }
    }
  }

  render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          ...this.state,
          resetErrors: this.resetErrors,
          getLayout: this.getLayout,
          postLayout: this.postLayout,
        }}
      >
        {children}
      </Provider>
    )
  }
}
