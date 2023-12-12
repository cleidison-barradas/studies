const { NeighborhoodRepository } = require("@mypharma/api-core")
const { ObjectId } = require("bson")


async function retrieve(searchResponse) {
    const { hits } = searchResponse
    try {
        const neighborsIds = hits.map(v => {
            const { _source: { body }} = v
            return new ObjectId(body.neighborhood_id)
        })
        const neighborhoods = await NeighborhoodRepository.repo().find({
            where: {
                _id: {$in: neighborsIds}
            }
        });

        return neighborhoods
    } catch (error) {
        console.log(error)
    }
}

module.exports = async (searchResponse) => {
    const neighborhoods = await retrieve(searchResponse)

    return neighborhoods
}