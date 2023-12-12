import { useCallback, useContext, useEffect } from 'react'
import ReactGA from 'react-ga'
import ReactGA4 from 'react-ga4'
import AuthContext from '../contexts/auth.context'
import cookieContext from '../contexts/cookies.context'
import { getProductActivePromotion } from '../helpers/getProductActivePromotion'
import Order from '../interfaces/order'
import Product from '../interfaces/product'

export const useEC = () => {
  const { store } = useContext(AuthContext)
  const { initialized } = useContext(cookieContext)


  useEffect(() => {
    ReactGA4.gtag('config', store?.settings.config_analytics_id, {
      'features': {
        'ecommerce': {
          'enabled': true,
          'trackTransactions': true,
          'trackProductImpressions': true,
          'trackProductDetails': true,
          'trackCheckout': true,
          'trackAbandonedCart': true,
          'event_category': 'Ecommerce',
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized])


  const buildGAproduct = useCallback((product: Product, list?: string, position?: number) => {
    const { EAN, name, manufacturer, category, price } = product

    return {
      id: EAN.toString(),
      name,
      brand: manufacturer?.name || 'Não possui',
      list,
      position,
      category: category && category.length > 0 ? category[0].name : 'Não possui',
      price: getProductActivePromotion(product) ? getProductActivePromotion(product)?.price : price,
    }
  }, [])

  const addImpression = useCallback(
    (products: Product[], list: string) => {
      if (!store?.settings.config_analytics_id || !initialized) return

      products.map((product, index) => {
        return ReactGA.ga('ec:addImpression', buildGAproduct(product, list, index))
      })

      products.map((product) => {
        return ReactGA4.gtag("event", "view_item", {
          currency: "BRL",
          items: [
            {
              item_id: product.EAN.toString(),
              item_name: product.name,
              affiliation: store.name,
              coupon: 'Sem coupon',
              item_category: product.category,
              price: product.price,
            }
          ]
        })
      })


      ReactGA.ga('send', 'pageview')
      ReactGA4.gtag('event', 'page_view')
    },
    [store, initialized, buildGAproduct]
  )

  const viewProduct = useCallback(
    (product: Product) => {
      if (!store?.settings.config_analytics_id || !initialized) return

      // version 3
      ReactGA.ga('ec:addProduct', buildGAproduct(product))
      ReactGA.ga('ec:setAction', 'detail')
      ReactGA.ga('send', 'pageview')

      // version 4
      ReactGA4.gtag("event", "view_item", {
        currency: "BRL",
        items: [
          {
            item_id: product.EAN.toString(),
            item_name: product.name,
            affiliation: store.name,
            coupon: 'Sem coupon',
            item_category: product.category,
            price: product.price,
          }
        ]
      })

      ReactGA4.gtag('ec:setAction', 'detail')
      ReactGA4.gtag('event', 'page_view')
    },
    [store, initialized, buildGAproduct]
  )

  const setStep = useCallback(
    (step: number, option?: string) => {
      if (!store?.settings.config_analytics_id || !initialized) return

      // version 3
      ReactGA.ga('require', 'ec')
      ReactGA.ga('ec:setAction', 'checkout', {
        step,
        option,
      })
      ReactGA.ga('send', 'pageview')

      // version 4
      ReactGA4.gtag('event', 'ec:setAction', 'checkout', {
        event_category: 'checkout',
        step,
        option,
      })
      ReactGA4.gtag('event', 'page_view')
    },
    [store, initialized]
  )

  const purchase = useCallback(
    (order: Order) => {
      if (!store?.settings.config_analytics_id || !initialized) return

      ReactGA.ga('require', 'ec')

      order.products.map(({ product }, index) => {
        return ReactGA.ga('ec:addProduct', buildGAproduct(product))

      })

      order.products.map(({ product }, index) => {
        return ReactGA4.gtag('event', 'add_to_cart', {
          currency: "BRL",
          items: [
            {
              item_id: product.EAN,
              item_name: product.name,
              affiliation: store.name,
              coupon: 'Sem coupon',
              item_category: product.category,
              price: product.price,
            }
          ]
        })
      })


      const id = order._id
      const revenue = order.totalOrder
      const shipping = order.deliveryData ? order.deliveryData.feePrice : 0

      ReactGA.ga('ec:setAction', 'purchase', {
        id,
        tax: 0,
        revenue,
        shipping,
        coupon: 'Sem coupon',
        affiliation: store.name,
      })


      ReactGA4.gtag('event', 'purchase', {
        transaction_id: id?.toString(),
        value: revenue,
        tax: 0,
        shipping,
        currency: 'BRL',
        coupon: 'Sem coupon',
        items: order.products.map(({ product, unitaryValue, amount }) => {
          return {
            item_id: product.EAN,
            item_name: product.name,
            affiliation: store.name,
            coupon: "Sem coupon",
            price: unitaryValue,
            quantity: amount
          }
        })
      })


      ReactGA.ga('send', 'pageview')
      ReactGA4.gtag('event', 'page_view')
      setStep(3)
      ReactGA.ga('send', 'pageview')
      ReactGA4.gtag('event', 'page_view')
    },
    [store, initialized, setStep, buildGAproduct]
  )

  const addToCart = useCallback(
    (product: Product, page: string) => {
      if (!store?.settings.config_analytics_id || !initialized) return

      // version 3
      ReactGA.ga('require', 'ec')
      ReactGA.ga('ec:addProduct', buildGAproduct(product))
      ReactGA.ga('ec:setAction', 'add')
      ReactGA.ga('send', 'event', page, 'click', 'addToCart')

      // version 4
      ReactGA4.gtag('event', 'add_to_cart', {
        currency: "BRL",
        items: [
          {
            item_id: product.EAN,
            item_name: product.name,
            affiliation: store.name,
            coupon: 'Sem coupon',
            item_category: product.category,
            price: product.price,
          }
        ]
      })
    },
    [store, initialized, buildGAproduct]
  )

  return {
    addImpression,
    viewProduct,
    purchase,
    addToCart,
  }
}
