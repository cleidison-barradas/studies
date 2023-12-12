import { useCallback, useContext } from 'react'
import { LayoutContext } from '../contexts/layout.context'

export const useLayout = () => {
  const { setisFooterHidden, setisHeaderHidden, setisContainerHidden } = useContext(LayoutContext)

  const toggleLayout = useCallback(() => {
    setisFooterHidden((value) => !value)
    setisHeaderHidden((value) => !value)
    setisContainerHidden((value) => !value)
  }, [setisFooterHidden, setisHeaderHidden, setisContainerHidden])

  return { toggleLayout }
}
