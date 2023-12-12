import { ProductRepository } from '@mypharma/api-core'

const params = {
  image: [
    'mockups/generico-tarja-preta.jpg',
    'mockups/tarja-preta-nao-generico.jpg',
    'mockups/tarja-vermelha-nao-generico.jpg',
    'mockups/generico-tarja-vermelha.jpg'
  ],
  classification: [
    'ETICO',
    'GENERICO',
    'SIMILAR',
  ],
}

async function getProductsInfo(): Promise<number> {
  const productsImageCounter = await ProductRepository.repo().count({
    $or: [
      { imageUrl: { $nin: [null, ''] } },
      { image: { $ne: null } },
    ],
    $and: [
      { image: { $ne: null } },
      { 'image.key': { $nin: params.image } },
      { 'classification.name': { $nin: params.classification }}
    ]
  })
  return productsImageCounter
}

export { getProductsInfo }
