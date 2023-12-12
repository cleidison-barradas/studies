import {
  ORM,
  Banner,
  Showcase,
  IAffiliateActions,
  IAffiliateEntities,
  CupomRepository,
  BannerRepository,
  ProductRepository,
  ShowcaseRepository,
} from "@mypharma/api-core"
import { QueuePlugin } from "../../../support/plugins/queue"

export const affiliateStoreService = async () => {
  QueuePlugin.on('affiliate-store-change', async ({ data, msg }: any) => {
    try {
      const { affiliate, mainStore } = data.content

      const entity = data.content.entity as IAffiliateEntities
      const action = data.content.action as IAffiliateActions
      const content = data.content.data as any

      if (affiliate) {
        await ORM.setup(null, affiliate)

        switch (entity) {
          case 'PRODUCT':
            delete content._id
            delete content.price
            delete content.quantity
            delete content.createdAt
            delete content.updatedAt

            let product = await ProductRepository.repo(affiliate).findOne({
              where: {
                EAN: content.EAN
              },
              select: ['EAN', 'name', 'description', 'presentation']
            })

            Object.keys(content).filter(k => typeof content[k] !== 'object').forEach(key => {
              product[key] = content[key]
            })


            if (action === 'CREATE') {

              if (!product) {

                product["image"] = content.image || null
                product["createdAt"] = new Date()

                product = await ProductRepository.repo(affiliate).createDoc(product)
              }
              console.log(`replicated data from ${mainStore} on ${affiliate}`)
            }

            if (action === 'UPDATE') {

              if (product) {
                delete product._id
                product.image = content.image || null
                product.updatedAt = new Date()

                await ProductRepository.repo(affiliate).updateOne({
                  EAN: content.EAN
                }, { $set: { ...product } })

                console.log(`replicated data from ${mainStore} on ${affiliate}`)
              }
            }

            if (action === 'DELETE') {

              await ProductRepository.repo(affiliate).deleteOne({ EAN: content.EAN })
              console.log(`replicated data from ${mainStore} on ${affiliate}`)
            }

            break;
          case 'CUPOM':
            let cupom = await CupomRepository.repo(affiliate).findOne({
              where: {
                code: content.code
              }
            })

            if (action === 'CREATE') {
              delete content._id
              delete content.createdAt
              delete content.updatedAt

              if (!cupom) {
                cupom = await CupomRepository.repo(affiliate).createDoc({
                  ...content,
                  createdAt: new Date()
                })

                console.log(`replicated data from ${mainStore} on ${affiliate}`)
              }
            }

            if (action === 'UPDATE') {

              if (cupom) {
                delete content._id
                delete content.createdAt
                content.updatedAt = new Date()

                await CupomRepository.repo(affiliate).updateOne({
                  code: content.code
                },
                  { $set: { ...content } })

                console.log(`replicated data from ${mainStore} on ${affiliate}`)

              }
            }

            if (action === 'DELETE') {

              await CupomRepository.repo(affiliate).deleteOne({ code: content.code })

              console.log(`replicated data from ${mainStore} on ${affiliate}`)
            }

            break;

          case 'PROMOTION':

            let exists = await ProductRepository.repo(affiliate).count({ EAN: content.EAN })

            if (action === 'CREATE') {

              if (exists > 0) {
                const specials = content.specials || []

                await ProductRepository.repo(affiliate).updateOne({
                  EAN: content.EAN
                },
                  { $set: { specials, updatedAt: new Date() } })

                console.log(`replicated data from ${mainStore} on ${affiliate}`)

              }
            }

            if (action === 'DELETE') {

              if (exists > 0) {
                const specials = content.specials || []

                await ProductRepository.repo(affiliate).updateOne({
                  EAN: content.EAN
                },
                  { $set: { specials, updatedAt: new Date() } })

                console.log(`replicated data from ${mainStore} on ${affiliate}`)
              }
            }

            break;

          case 'SHOWCASE':

            let showcase = await ShowcaseRepository.repo(affiliate).findOne({
              where: {
                originalId: content.originalId
              }
            })

            if (action === 'CREATE') {

              if (!showcase) {
                showcase = new Showcase()

                delete content._id
                delete content.createdAt
                delete content.updatedAt
                showcase._id = undefined

                Object.keys(content).filter(k => typeof content[k] !== 'object').forEach(key => {
                  showcase[key] = content[key]
                })

                const eans = content.products?.map((_product: any) => String(_product.product.EAN))

                const data = await ProductRepository.repo(affiliate).find({
                  where: {
                    EAN: { $in: eans }
                  }
                })
                showcase.products = []
                showcase.position = content.position || null
                showcase.finalDate = content.finalDate || null
                showcase.initialDate = content.initialDate || null
                showcase.createdAt = new Date()

                content.products?.forEach(showCaseProduct => {
                  const product = data.find(_p => _p.EAN === String(showCaseProduct.product.EAN))

                  if (product) {
                    showcase.products.push({
                      product,
                      position: showCaseProduct.position,
                    })
                  }
                })

                await ShowcaseRepository.repo(affiliate).createDoc(showcase)
                console.log(`replicated data from ${mainStore} on ${affiliate}`)
              }
            }

            if (action === 'UPDATE') {

              if (showcase) {
                delete content._id
                delete showcase._id
                delete content.createdAt
                delete content.updatedAt
                showcase.products = []

                Object.keys(content).filter(k => typeof content[k] !== 'object').forEach(key => {
                  showcase[key] = content[key]
                })

                const eans = content.products?.map((_product: any) => String(_product.product.EAN))

                const data = await ProductRepository.repo(affiliate).find({
                  where: {
                    EAN: { $in: eans }
                  }
                })

                content.products?.forEach(showCaseProduct => {
                  const product = data.find(_p => _p.EAN === String(showCaseProduct.product.EAN))

                  if (product) {
                    showcase.products.push({
                      product,
                      position: showCaseProduct.position,
                    })
                  }
                })

                showcase.updatedAt = new Date()

                await ShowcaseRepository.repo(affiliate).updateOne({ originalId: content.originalId }, { $set: { ...showcase } })
                console.log(`replicated data from ${mainStore} on ${affiliate}`)
              }
            }

            if (action === 'DELETE') {

              if (showcase) {
                await ShowcaseRepository.repo(affiliate).deleteOne({ originalId: content.originalId })
                console.log(`replicated data from ${mainStore} on ${affiliate}`)
              }
            }

            break;

          case 'BANNERS':
            const BulkBanners: any[] = []

            if (action === 'UPDATE') {
              await BannerRepository.repo(affiliate).deleteMany({ _id: { $exists: true } })

              content.forEach((banner: Banner) => {
                delete banner._id
                delete banner.createdAt
                delete banner.updatedAt

                banner.createdAt = new Date()

                BulkBanners.push({
                  insertOne: banner
                })
              })

              if (BulkBanners.length > 0) {

                await BannerRepository.repo(affiliate).bulkWrite(BulkBanners)
                console.log(`replicated data from ${mainStore} on ${affiliate}`)
              }
            }

            break;
          default:
            break;
        }
      }

      await QueuePlugin.ack('affiliate-store-change', msg)

    } catch (error) {
      console.log(error)
      await QueuePlugin.ack('affiliate-store-change', msg)
    }
  })

  await QueuePlugin.consume('affiliate-store-change')
}