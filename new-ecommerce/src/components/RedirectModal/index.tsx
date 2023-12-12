import { isBefore } from 'date-fns'
import { addDays } from 'date-fns/esm'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { StorageKeys } from '../../config/keys'
import AuthContext from '../../contexts/auth.context'
import { CheckoutModal } from '../CheckoutModal'
import { RedirectContent } from '../RedirectContent'

export const RedirectModal: React.FC = () => {
  const { store } = useContext(AuthContext)
  const [storeUrls, setStoreUrls] = useState(false)
  const [storeGroups, setStoreGroups] = useState(false)
  const { search } = useLocation()
  const navigate = useNavigate()

  const handleOpenModal = useCallback(() => {
    if (store) {
      const { urls, groups, settings: { config_always_show_popup = false } } = store
      const redirect = localStorage.getItem(StorageKeys.redirect)
      const nextRedirect = redirect ? new Date(redirect) : null

      if (config_always_show_popup && (!nextRedirect || isBefore(nextRedirect, new Date()))) {

        if (search.includes('?noredirect')) {
          localStorage.setItem(StorageKeys.redirect, addDays(new Date(), 1).toString())
        }

        if ((!urls || urls.length <= 0) && groups && (typeof groups.stores === 'object') && search !== '?noredirect') {
          setStoreGroups(true)
        }
      }

      const session = localStorage.getItem(StorageKeys.ecommerce_session)
      const expiresIn = session ? new Date(session) : null

      if ((!expiresIn && !config_always_show_popup) || (expiresIn && isBefore(expiresIn, new Date()))) {
        if (urls && urls.length > 0 && (!groups || groups.stores === undefined) && search !== '?noredirect') {
          setStoreUrls(true)
          localStorage.setItem(StorageKeys.ecommerce_session, addDays(new Date(), 1).toString())
        }

        if ((!urls || urls.length <= 0 ) && groups && (typeof groups.stores === 'object')  && search !== '?noredirect') {
          setStoreGroups(true)
          localStorage.setItem(StorageKeys.ecommerce_session, addDays(new Date(), 1).toString())
        }
      }
    }
    if (search.includes('?noredirect')) navigate('/produtos')

  }, [search, store, navigate])

  useEffect(() => {
    handleOpenModal()

  }, [handleOpenModal])

  const handleClose = () => {
    if (storeUrls) {
      setStoreUrls(false)
    }

    if (storeGroups) {
      setStoreGroups(false)
    }
  }

  return (
    <CheckoutModal onClose={handleClose} open={storeUrls || storeGroups} disableClose={store?.settings.config_always_show_popup} >
      {store?.urls && store.urls.length > 0 && <RedirectContent urls={store?.urls} />}
      {store?.groups && (typeof store.groups.stores === 'object') && <RedirectContent groups={store?.groups} />}
    </CheckoutModal>
  )
}
