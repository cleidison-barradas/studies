import { useCallback, useContext } from 'react'
import TabBarContext from '../contexts/tabbar.context'

export const useTabBar = () => {
  const { hideTabbar } = useContext(TabBarContext)

  const toggleTabBar = useCallback(() => {
    hideTabbar((value) => !value)
  }, [hideTabbar])

  return {
    toggleTabBar,
  }
}
