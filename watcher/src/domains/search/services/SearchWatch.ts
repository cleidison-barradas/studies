import { configureScope, captureException } from '@sentry/node'
import { ObjectID } from 'mongodb'
import { AMQP } from '../../../support/plugins/queue'
import { searchRepository } from '../repositories/SearchRepository'
import { storeRepository } from '../repositories/StoreRepository'
import { userRepository } from '../repositories/UserRepository'
import { SearchResult } from '../../../support/interfaces/SearchResult'

export const searchWatchService = async () => {
  const amqp = AMQP.getInstance()

  // Start channels
  await amqp.start('search-capture')
  await amqp.start('attraction-capture')
  await amqp.start('star-capture')
  await amqp.start('superstar-capture')

  // Capture new search
  amqp.on('search-capture', async (data) => {
    const { content } = data
    const { fingerprint, store, user, term, products, origin, userAgent } = content

    try {
      let searchEntity = await searchRepository.getByFingerprint(fingerprint)
      let storeEntity = await storeRepository.getById(store.storeId)
      let userEntity = user ? await userRepository.getById(user.userId) : null
      
      // Mounting result
      const result: SearchResult = {
        term: term,
        origin: origin,
        topScorer: products.sort((a, b) => b.score - a.score)[0],
        attractions: [],
        stars: [],
        superstars: []
      }

      // Create store if does not exists yet
      if (!storeEntity) {
        storeEntity = await storeRepository.create(store)
      }

      // Create user if does not exists yet
      if (!userEntity && user) {
        userEntity = await userRepository.create(user)
      }

      if (storeEntity.storeId && isNaN(storeEntity.storeId as any)) {
        storeEntity.storeId = new ObjectID(storeEntity.storeId.toString())
      }

      // Create new search capture
      if (!searchEntity) {
        searchEntity = await searchRepository.repository.save({
          fingerprint: fingerprint,
          term: term,
          store: storeEntity,
          user: userEntity,
          userAgent: userAgent,
          converted: false,
          result: [result]
        })
      } else {
        // The term has changed, so we need to update our result with the new term
        if (searchEntity.term !== term) {
          searchEntity.term = term
          searchEntity.result.push(result)
          await searchEntity.save()
        }
      }
    } catch (err) {
      console.log(err)
      configureScope(scope => {
        scope.setTag('queue', 'search-capture')
        scope.setExtra('content', content)
        scope.setFingerprint([fingerprint])

        captureException(err)
      })
    }
  })

  // Capture attractions
  amqp.on('attraction-capture', async (data) => {
    const { content } = data
    const { fingerprint, product, origin } = content
    
    try {
      let searchEntity = await searchRepository.getByFingerprint(fingerprint)

      // We just can continue if this was captured in search already :/
      if (searchEntity) {
        let result = searchEntity.result.find(p => p.term === searchEntity.term)
        const index = searchEntity.result.findIndex(p => p.term === searchEntity.term)
        if (result) {
          const exists = result.attractions.find(p => p.id === product.id) !== undefined

          if (!exists) {
            result.origin = origin
            result.attractions.push(product)
            
            // Save
            searchEntity.result[index] = result
            await searchEntity.save()
          }
        }
      }
    } catch (err) {
      configureScope(scope => {
        scope.setTag('queue', 'attraction-capture')
        scope.setExtra('content', content)
        scope.setFingerprint([fingerprint])

        captureException(err)
      })
    }
  })

  // Capture star!!! We have converted :D
  amqp.on('star-capture', async (data) => {
    const { content } = data
    const { fingerprint, product, origin } = content
    
    try {
      let searchEntity = await searchRepository.getByFingerprint(fingerprint)

      // We just can continue if this was captured in search already :/
      if (searchEntity) {
        let result = searchEntity.result.find(p => p.term === searchEntity.term)
        const index = searchEntity.result.findIndex(p => p.term === searchEntity.term)
        if (result) {
          const exists = result.stars.find(p => p.id === product.id) !== undefined
          if (!exists) {
            result.origin = origin
            result.stars.push(product)
            
            // Save
            searchEntity.result[index] = result
          }
        }

        // Search converted
        searchEntity.converted = true
        await searchEntity.save()
      }
    } catch (err) {
      configureScope(scope => {
        scope.setTag('queue', 'star-capture')
        scope.setExtra('content', content)
        scope.setFingerprint([fingerprint])

        captureException(err)
      })
    }
  })

  // Capture superstar!!! We have converted :D
  amqp.on('superstar-capture', async (data) => {
    const { content } = data
    const { fingerprint, product, origin } = content

    try {
      let searchEntity = await searchRepository.getByFingerprint(fingerprint)

      // We just can continue if this was captured in search already :/
      if (searchEntity) {
        let result = searchEntity.result.find(p => p.term === searchEntity.term)
        const index = searchEntity.result.findIndex(p => p.term === searchEntity.term)
        if (result) {
          const exists = result.superstars.find(p => p.id === product.id) !== undefined
          if (!exists) {
            result.origin = origin
            result.superstars.push(product)
            
            // Save
            searchEntity.result[index] = result
          }
        }

        // Search converted
        searchEntity.converted = true
        await searchEntity.save()
      }
    } catch (err) {
      configureScope(scope => {
        scope.setTag('queue', 'superstar-capture')
        scope.setExtra('content', content)
        scope.setFingerprint([fingerprint])

        captureException(err)
      })
    }
  })
}
