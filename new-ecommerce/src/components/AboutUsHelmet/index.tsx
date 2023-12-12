import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import AuthContext from '../../contexts/auth.context'

export const AboutUsHelmet: React.FC = () => {
  const { store } = useContext(AuthContext)

  const title = `Saiba mais sobre a ${store?.name} - ${store?.settings.config_store_city}`
  const description = `Conheça mais sobre a ${store?.name} - ${store?.settings.config_store_city} com o melhor atendimento,medicamentos e linha completa de perfumaria!`

  return (
    <Helmet>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Helmet>
  )
}
