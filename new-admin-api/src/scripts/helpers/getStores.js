const { StoreRepository } = require('@mypharma/api-core')

function getStores() {
    return StoreRepository.repo().find({
        select: ["tenant"]
    })
}

module.exports = {getStores}
//this is a callback function