import React from 'react'
import { ShareIcon } from '../../assets/icons'
import { ShareLink } from './styles'
import { share } from '../../helpers/share'
import { useAlert } from '../../hooks/useAlert'

interface ProductShareButtonProps {
  name: string
}

export const ProductShareButton: React.FC<ProductShareButtonProps> = ({ name }) => {
  const { showMessage } = useAlert()

  async function copyToClipBoard() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
      showMessage('link do produto copiado', 'info')
    }
  }

  return (
    <React.Fragment>
      {navigator.share !== undefined ? (
        <ShareLink onClick={() => share({ title: name, text: name, url: window.location.href })}>
          <ShareIcon />
          Compartilhar
        </ShareLink>
      ) : (
        <ShareLink onClick={copyToClipBoard}>
          <ShareIcon />
          Compartilhar
        </ShareLink>
      )}
    </React.Fragment>
  )
}
