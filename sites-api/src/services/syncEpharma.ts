import { Benefit, BenefitProduct, BenefitProductRepository, BenefitRepository, ORM, ProductRepository, StoreRepository } from '@mypharma/api-core'
import EpharmaService from '../adapters/EpharmaService'
import EpharmaGetBenefitByOriginalIdService from '../domains/v2/epharma/services/EpharmaGetBenefitByOriginalIdService'
import EpharmaGetBenefitProductEanService from '../domains/v2/epharma/services/EpharmaGetBenefitProductByEanService'
import EpharmaGetBenefitProductsEansService from '../domains/v2/epharma/services/EpharmaGetBenefitProductsByEansService'

const epharmaGetBenefitByOriginalIdService = new EpharmaGetBenefitByOriginalIdService()
const epharmaGetBenefitProductsEansService = new EpharmaGetBenefitProductsEansService()
const epharmaGetBenefitProductEanService = new EpharmaGetBenefitProductEanService()

export const epharmaService = async () => {

  const store = await StoreRepository.repo().findOne({
    where: {
      tenant: 'novamypharma'
    },
    select: ['settings', 'tenant']
  })

  const tenant = store.tenant
  await ORM.setup(null, store.tenant)

  try {
    const bulkWriteBenefit = []
    const bulkWriteStoreProduct = []
    const bulkWriteBenefitProduct = []
    const eans: string[] = []

    const epharmaService = new EpharmaService()

    epharmaService.config({ store })

    const accessToken = await epharmaService.authenticate({ storeId: store._id.toString() })

    const { data: benefits } = await epharmaService.getIndustryAssociatedProducts({ accessToken })

    if (benefits.error) {
      console.log(benefits)
      throw new Error('error_on_sync_epharma_products')
    }

    for await (const entry of benefits.data) {
      const originalId = entry.benefit.id

      const benefitExists = await epharmaGetBenefitByOriginalIdService.getBenefitByOriginalId({ tenant, originalId })

      if (!benefitExists) {
        const benefit = new Benefit()

        benefit._id = undefined
        benefit.phone = entry.benefit.phone
        benefit.originalId = entry.benefit.id
        benefit.siteUrl = entry.benefit.siteUrl
        benefit.benefitName = entry.benefit.name
        benefit.clientId = entry.benefit.client.id
        benefit.clientName = entry.benefit.client.name
        benefit.requiresMembership = entry.benefit.requiresMembership
        benefit.allowCustomMembership = entry.benefit.allowCustomMembership
        benefit.allowCustomMembershipPDV = entry.benefit.allowCustomMembershipPDV
        benefit.createdAt = new Date()

        bulkWriteBenefit.push({
          insertOne: benefit
        })
      }

      const { products } = entry.benefit

      for await (const product of products) {
        const ean = product.ean

        const benefitProductExists = await epharmaGetBenefitProductEanService.getBenefitProductByEan({ tenant, ean })

        if (!benefitProductExists) {
          const benefitProduct = new BenefitProduct()
          benefitProduct._id = undefined
          benefitProduct.ean = product.ean
          benefitProduct.name = product.name
          benefitProduct.benefitId = entry.benefit.id
          benefitProduct.salePrice = product.salePrice
          benefitProduct.presentation = product.presentation
          benefitProduct.maximumPrice = product.maximumPrice
          benefitProduct.discountPercent = product.discountPercent
          benefitProduct.commercialGrade = product.commercialGrade
          benefitProduct.commercialGradeId = product.commercialGradeId
          benefitProduct.calculationRuleType = product.calculationRuleType
          benefitProduct.calculationRuleTypeId = product.calculationRuleTypeId
          benefitProduct.replacementPurchasePrice = product.replacementPurchasePrice
          benefitProduct.replacementIndustryPrice = product.replacementIndustryPrice
          benefitProduct.replacementIndustryDiscount = product.replacementIndustryDiscount
          benefitProduct.createdAt = new Date()

          bulkWriteBenefitProduct.push({
            insertOne: benefitProduct
          })

          eans.push(ean)
        }
      }
    }

    if (bulkWriteBenefit.length > 0) {
      const benefitResponse = await BenefitRepository.repo(store.tenant).bulkWrite(bulkWriteBenefit)

      console.log(`stored ${benefitResponse.insertedCount} benefits`)
    }

    if (bulkWriteBenefitProduct.length > 0) {
      const benefitProductResponse = await BenefitProductRepository.repo(store.tenant).bulkWrite(bulkWriteBenefitProduct)

      console.log(`stored ${benefitProductResponse.insertedCount} products`)
    }


    if (eans.length > 0) {
      const products = await epharmaGetBenefitProductsEansService.getBenefitProductsByEans({ tenant, eans })

      if (products.length > 0) {

        for await (const product of products) {

          const benefit = await epharmaGetBenefitByOriginalIdService.getBenefitByOriginalId({ tenant, originalId: product.benefitId })

          if (benefit) {

            bulkWriteStoreProduct.push({
              updateOne: {
                filter: { EAN: product.ean },
                update: {
                  '$set': {
                    benefit,
                    benefit_sale_price: Number(product.salePrice),
                    updatedAt: new Date()
                  }
                }
              }
            })
          }
        }

        await ProductRepository.repo(tenant).bulkWrite(bulkWriteStoreProduct)
      }
    }
  } catch (error) {
    console.log('error ->', error)
  }
}
