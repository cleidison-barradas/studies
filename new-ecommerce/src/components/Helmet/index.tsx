import React, { useContext } from 'react'
import { Helmet as ReactHelmet } from 'react-helmet'
import { useLocation } from 'react-router'
import { CDN } from '../../config/keys'
import AuthContext from '../../contexts/auth.context'
import { isUsingInstalled } from '../../helpers/isUsingInstalled'

export const Helmet: React.FC = () => {
  const { store } = useContext(AuthContext)
  const { settings } = store!
  const { config_meta_description, config_meta_title, config_logo, config_tawk_embed } = settings
  const { pathname } = useLocation()
  const isInstalled = isUsingInstalled()

  return (
    <ReactHelmet>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Poppins:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <meta name="title" content={config_meta_title || store?.name} />
      <title> {config_meta_title || store?.name} </title>
      <meta name="description" content={config_meta_description} />

      <meta property="og:title" content={config_meta_title || store?.name} />

      <meta property="og:description" content={config_meta_description} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content={`${CDN.image}${config_logo}`} />
      {config_logo && <link rel="apple-touch-icon" href={new URL(config_logo, CDN.image).href} />}
      <meta name="theme-color" content={store?.settings.config_navbar_color} />
      {config_tawk_embed && <script src={config_tawk_embed} />}

      {pathname === '/' && (
        <link rel="canonical" href={new URL('/produtos', window.location.href).href} />
      )}

      {!isInstalled && <meta name="apple-mobile-web-app-capable" content="yes" />}

      <meta name="apple-mobile-web-app-title" content={store?.name} />
    </ReactHelmet>
  )
}
