import  XLSX  from 'xlsx-js-style'
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthHandlerMiddleware,
  Body,
  Delete,
  Get,
  IntegrationErpRepository,
  IntegrationRepository,
  IntegrationUserErp,
  IntegrationUserErpRepository,
  JsonController,
  ORM,
  Param,
  Post,
  Put,
  QueryParams,
  Res,
  Store,
  StoreRepository,
  UseBefore,
  ObjectID
} from '@mypharma/api-core'
import { Response } from 'express'
import { createIntegrationData, getIntegrationApiData, updateIntegrationData } from './integrationApi.service'
import { IntegrationApiBody } from './interfaces/integrationApiInterface'


@JsonController('/v1/integration-api')
export default class IntegrationApiController {

  @Post()
  async returnIntegrationApiData(@Res() response: Response, @Body() body: IntegrationApiBody): Promise<unknown> {

    try {
      await ORM.setup(null, 'integration')
      const currentIntegrationData = await getIntegrationApiData(body._id)

      let integrationData = {}

      if(currentIntegrationData){
        integrationData = {
          trierData: {
            token: currentIntegrationData.token,
            baseUrl: currentIntegrationData.baseUrl
          }
        }
      }

      return ({ integrationData })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Put()
  async createOrUpdateIntegrationApiData(@Res() response: Response, @Body() body: IntegrationApiBody): Promise<Store | unknown> {

    try {

      await ORM.setup(null, 'integration')
      const { _id, integrationData } = body

      const currentIntegrationData = await getIntegrationApiData(_id)
      if(currentIntegrationData){
        await updateIntegrationData(_id, integrationData, currentIntegrationData)
      } else {
        await createIntegrationData(_id, integrationData)
      }

      return response.status(201).json({ ok: 'ok'})

    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }
}
