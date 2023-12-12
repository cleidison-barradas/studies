import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { CDN } from '../../config/keys'
import AuthContext from '../../contexts/auth.context'
import { normalizeStr } from '../../helpers/normalizeString'
import { markupBuilder } from '../../helpers/productMarkupBuilder'
import Product from '../../interfaces/product'

interface ProductHelmetProps {
  product: Product
}

export const ProductHelmet: React.FC<ProductHelmetProps> = ({ product }) => {
  const { metaTitle='', metaDescription='', image='', name='', presentation='' } = product
  const { store } = useContext(AuthContext)
  const { settings } = store!

  const metaDescriptionBuilder = () => {
    if (metaDescription) return metaDescription

    if (
      product.category &&
      product.category.length > 0 &&
      normalizeStr(product.category[0].name || '').toLocaleLowerCase() !== 'outros'
    ) {
      return `${name} em ${settings.config_store_city} você encontra aqui no site da ${settings.config_name}, além de toda linha completa de ${product.category[0].name}!`
    } else
      return `${name} em ${settings.config_store_city} você encontra aqui no site da ${settings.config_name}!`
  }

  const metaTitleBuilder = () => {
    if (metaTitle) return metaTitle

    return `${name} ${presentation || ''} - ${settings.config_store_city}`
  }

  return (
    <Helmet>
      {settings.config_schema_markup && (
        <script type="application/ld+json">{`${JSON.stringify(
          JSON.parse(settings.config_schema_markup.replace(/&quot;/g, '"'))
        )}`}</script>
      )}
      <script type="application/ld+json">{markupBuilder(product)}</script>
      <meta name="title" content={metaTitleBuilder()} />
      <title> {metaTitle} </title>

      <meta name="description" content={metaDescriptionBuilder()} />

      <meta property="og:title" content={metaTitleBuilder()} />

      <meta property="og:url" content={window.location.href} />
      <meta property="og:description" content={metaDescriptionBuilder()} />
      {image && image.key && <meta property="og:image" content={new URL(image.key, CDN.image!).href} />}
    </Helmet>
  )
}
