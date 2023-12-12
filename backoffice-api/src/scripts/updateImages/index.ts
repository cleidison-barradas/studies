// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

import { FileRepository, ProductRepository, ORM } from '@mypharma/api-core'
import { databaseConfig } from '../../config/database'

import { uploadImageToS3 } from './utils/awsS3'
import { UploadReport } from './helpers/uploadReport'
import { ObjectId } from 'bson'
const uploadReportFunctions = new UploadReport()

export default (async () => {
  try {
    ORM.config = databaseConfig
    await ORM.setup(null)

    console.log(chalk.cyan.bold('Iniciando o processo de upload das imagens...\n'))

    const dataPath = path.join(__dirname, 'png') // test é onde são realizados os testes, png é a pasta com 72k de imagens.

    const counters = {
      validImage: 0,
      modifiedProduct: 0,
    }

    //The script will upload the images in this s3 folder (myp-public/'folder').
    const folder = 'products2'

    fs.readdir(dataPath, async (error, files) => {
      if (error) console.error('Can\'t catch the files! ', error)

      console.log('files.length', files.length)
      await uploadReportFunctions.createReports(__dirname)

      let chunk = 0
      let i = 1

      while (chunk <= files.length) {
        const images = files.splice(chunk, chunk + 1000)

        for await (const fileName of images) {

          const imageEAN = fileName.replace(/\.[^.\\/:*?"<>|\r\n]+$/, '')

          const products = await ProductRepository.repo().find({
            where: {
              EAN: imageEAN,
              control: { $eq: null },
              $and: [
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

          })

          if (products && products.length > 0) {
            const { Location, Key } = await uploadImageToS3(`${dataPath}/${fileName}`, fileName, folder)
            const image = await FileRepository.repo().createDoc({
              name: Key,
              key: Key,
              url: Key,
              folder,
            })

            for await (const product of products) {
              const _id = new ObjectId(product._id.toString())

              if (product.image || product.imageUrl) ++counters.validImage

              const imageUrl = Location

              const { modifiedCount } = await ProductRepository.repo().updateOne({ _id }, {
                $set: {
                  image,
                  imageUrl,
                  updatedAt: new Date()
                }
              })

              counters.modifiedProduct += modifiedCount
              await uploadReportFunctions.uploadReport(__dirname, counters, i++)
            }

          } else {
            await uploadReportFunctions.uploadReport(__dirname, counters, i++)
            await uploadReportFunctions.addUnregistrerEAN(__dirname, imageEAN)
          }
        }
        chunk = chunk + 1000
      }
    })

    // console.log(chalk.cyan.bold('Upload das imagens concluido!\n'))
  } catch (error) {
    console.error(error)
  }

})()

