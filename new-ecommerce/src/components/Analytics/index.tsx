import React, { useCallback, useContext, useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import ReactGA4 from 'react-ga4'
import TagManager from 'react-gtm-module'
import { hotjar } from 'react-hotjar'
import { useLocation } from 'react-router'
import AuthContext from '../../contexts/auth.context'
import cookieContext from '../../contexts/cookies.context'

export const Analytics: React.FC = () => {
  const { store } = useContext(AuthContext)
  const { isAllowed, initialized, setInitialized } = useContext(cookieContext)
  const { pathname, search } = useLocation()

  const init = useCallback(() => {
    const { config_analytics_id, config_google_tag_manager_id, config_pixel_id, config_hotjar_id } =
      store!.settings

    if (config_analytics_id) {
      const isVersion4 = config_analytics_id.startsWith('G-')

      if (isVersion4) {
        ReactGA4.initialize(config_analytics_id)
        ReactGA4.send({ hitType: 'pageview', page: pathname, title: search })
      } else {
        ReactGA.initialize(config_analytics_id)
        ReactGA.pageview(pathname)
        ReactGA.ga('require', 'ec')
      }
    }

    if (config_google_tag_manager_id) TagManager.initialize({ gtmId: config_google_tag_manager_id })
    if (config_pixel_id) ReactPixel.init(config_pixel_id)
    if (config_hotjar_id) hotjar.initialize(config_hotjar_id as any, 6, false)

    setInitialized(true)
  }, [store, pathname, search, setInitialized])

  useEffect(() => {
    if (isAllowed === true && !initialized) {
      init()
    }
  }, [isAllowed, initialized, init])

  useEffect(() => {
    const { config_analytics_id, config_pixel_id } = store!.settings

    if (isAllowed && initialized) {
      if (config_analytics_id) {
        const isVersion4 = config_analytics_id.startsWith('G-')

        if (isVersion4) {
          ReactGA4.send({ hitType: 'pageview', page: pathname, title: search })
        } else {
          ReactGA.pageview(pathname)
        }
      }
      if (config_pixel_id) ReactPixel.pageView()
    }
  }, [isAllowed, store, pathname, search, initialized])

  return <React.Fragment />
}
