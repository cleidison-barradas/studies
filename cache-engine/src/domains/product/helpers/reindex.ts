import elasticsearch, { BulkData } from "../../../support/plugins/elasticsearch"
import { getProduct } from "../services/GetProduct"

export const reindexProduct = async (tenant: string, eans: string[] = []) => {

  try {
    let bulkData: BulkData[] = []

    const products = await getProduct(tenant, eans)

    products.forEach(product => {
      const { category = [] } = product
      let slug = null
      let categories = []

      if (product.slug && product.slug.length > 0) {
        slug = product.slug.pop()
      }

      if (category.length > 0) {

        category.forEach(c => {
          if (c.name && c.name.length > 0) categories.push(c.name.toString())
        })
      }

      bulkData.push({
        id: product._id.toString(),
        index: {
          prefix: 'mongo_store',
          id: tenant
        },
        product_id: product._id.toString(),
        price: product.price || 0,
        ean: product.EAN,
        name: product.name,
        slug: slug,
        status: product.status,
        presentation: product.presentation || '',
        quantity: product.quantity,
        specials: product.specials || [],
        erp_pmc: product.erp_pmc || null,
        pmcPrice: product.pmcPrice || null,
        pmcValues: product.pmcValues || [],
        manualPMC: product.manualPMC || false,
        image: product.image || null,
        control: product.control || null,
        description: product.description,
        active_principle: product.activePrinciple,
        manufacturer: product.manufacturer || null,
        classification: product.classification || null,
        deletedAt: product.deletedAt || null,
        benefit: product.benefit || null,
        benefit_sale_price: product.benefit_sale_price || 0,
        categories: categories.length > 0 ? categories.toString() : null
      })

      categories = []
    })
    await elasticsearch.bulk(bulkData)

    await elasticsearch.refresh(null, { id: tenant, prefix: 'mongo_store' })

    const indexed = bulkData.length

    bulkData = []

    return indexed

  } catch (error) {
    console.log(error)
  }
}

export const reindexSuggestions = async (tenant: string, eans: string[] = []) => {
  try {
    let bulkData: BulkData[] = []

    const products = await getProduct(tenant, eans)

    products.forEach(product => {
      const { activePrinciple = '', manufacturer = null } = product
      const name = []

      if (product.EAN && product.EAN.length > 0 && product.name && product.name.length > 0) {
        const input = product.name.split(' ')[0].normalize('NFD').replace(/[^A-Z0-9]+/ig, ' ').trim().toLowerCase()

        name.push({
          input,
          weight: 34
        })

        name.push({
          input: product.name,
          weight: 10
        })

        if (activePrinciple.length > 0) {
          name.push({
            input: activePrinciple,
            weigth: 3
          })
        }

        if (manufacturer) {
          name.push({
            input: manufacturer?.name,
            weight: 3
          })
        }

        bulkData.push({
          id: product.EAN,
          index: {
            id: process.env.NODE_ENV,
            prefix: 'mongo_store_suggest',
          },
          name,
          rank: 0,
          ean: product.EAN,
          suggest_type: 'keyword_suggestion'
        })
      }
    })

    await elasticsearch.bulk(bulkData)
    await elasticsearch.refresh('', { id: 'storeadmin', prefix: 'mongo_store_suggest' })

    const indexed = bulkData.length

    bulkData = []

    return indexed


  } catch (error) {
    console.log(error.meta.body.error)
    return 0
  }
}