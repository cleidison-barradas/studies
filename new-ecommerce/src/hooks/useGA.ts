import { useCallback, useContext } from 'react'
import cookieContext from '../contexts/cookies.context'
import ReactGA from 'react-ga'

export const useGA = () => {
  const { initialized } = useContext(cookieContext)

  const event = useCallback(
    (category: string, action: string, label?: string) => {
      if (!initialized) return null

      ReactGA.event({ category, action, label })
    },
    [initialized]
  )

  return {
    event,
  }
}
