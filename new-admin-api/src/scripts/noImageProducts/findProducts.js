const {ProductRepository} = require('@mypharma/api-core')

async function countDBProducts() {
  return await ProductRepository.repo().count()
}

function findProducts(skip, take) {
     return ProductRepository.repo().find({
        select: ["EAN", "image", "control"],
        where: {
            control: { $eq: null },
            $and: [
              {
                $or: [{ 'image.key': 'mockups/sem-imagem-padrao.jpg' }, { image: null }],
              },
              {
                'image.key': {
                  $ne: 'mockups/generico-tarja-preta.jpg',
                },
              },
              {
                'image.key': {
                  $ne: 'mockups/tarja-preta-nao-generico.jpg',
                },
              },
              {
                'image.key': {
                  $ne: 'mockups/tarja-vermelha-nao-generico.jpg',
                },
              },
              {
                'image.key': {
                  $ne: 'mockups/generico-tarja-vermelha.jpg',
                },
              },
            ],
        },
        skip,
        take
    })
}

module.exports = {countDBProducts, findProducts}