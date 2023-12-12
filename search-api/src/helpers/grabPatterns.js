const { ProductRepository } = require('@mypharma/api-core');

const selectFields = [
    '_id',
    'EAN',
    'name',
    'slug',
    'price',
    'image',
    'status',
    'erp_pmc',
    'benefit',
    'control',
    'specials',
    'pmcPrice',
    'quantity',
    'pmcValues',
    'manualPMC',
    'presentation',
    'manufacturer',
    'classification',
    'activePrinciple',
    'benefit_sale_price'
]

const fetchProducts = async (tenant, query) => {
    return await ProductRepository.repo(tenant).find(query)
}

const grabPatterns = async (activePrinciples = [], tenant) => {
    const query = {
        where: {
            activePrinciple: {
                $in: activePrinciples
            },
            classification: { $ne: null },
            'classification.name': 'GENERICO',
            quantity: {
                $gt: 0
            },
            status: true,
        },
        take: 20,
        select: selectFields,
    }

    const products = await fetchProducts(tenant, query)
    return products
}

module.exports = grabPatterns