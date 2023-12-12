import { useCallback, useContext } from 'react'
import ReactGA4 from 'react-ga4'
import cookieContext from '../contexts/cookies.context'

export const useGA4 = () => {
  const { initialized } = useContext(cookieContext)

  const eventGA4 = useCallback(
    (category: string, action: string, label?: string) => {
      if (!initialized) return null

      ReactGA4.gtag('event', category, {
        action,
        label,
      })

    },
    [initialized]
  )

  return {
    eventGA4,
  }
}
