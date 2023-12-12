import { Get, JsonController, Param, NotFoundError, Req, QueryParam, Res, Put, ApiRequest, Body } from '@mypharma/api-core'
import { Response } from 'express'
import { StoreNotFoundException } from './exceptions/StoreNotFoundException'
import { StoreService } from './store.service'

@JsonController('/v2/store')
export class StoreController {
  private storeService: StoreService

  constructor() {
    this.storeService = new StoreService()
  }

  @Get('/manifest')
  public async getManifest(@Res() response: Response, @QueryParam('origin') origin: string) {
    try {
      const store = await this.storeService.getStoreByURL(origin)

      if (!store) {
        return response.status(404).json({
          error: 'store_not_found'
        })
      }

      const { url, name, settings } = store
      const { config_logo = '', config_navbar_color = '#ffffff' } = settings
      const imageType = config_logo.split('.').pop()

      return response.json({
        name,
        short_name: name,
        icons: [
          {
            src: new URL(config_logo, process.env.IMAGES_CDN).href,
            sizes: 'any',
            type: `image/${imageType}`,
            purpose: 'maskable any',
          },
        ],
        start_url: new URL('/produtos', url).href,
        display: 'standalone',
        theme_color: config_navbar_color,
        background_color: '#ffffff'
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }

  @Get('/storeGroup')
  public async getStoreGroup(@QueryParam('url') url: string) {

    const mainStore = await this.storeService.getMainStore(url)

    //if there is a store that contains parameter store (url) in storeUrls array
    if (mainStore) {
      const parsedMainStore = {'name': mainStore.name, 'url': mainStore.url, 'address': `${mainStore.settings.config_address}, ${mainStore.settings.config_store_number} - ${mainStore.settings.config_store_city}`}
      const storeGroup = await this.storeService.getFilialsInformation(mainStore.storeUrls)
      storeGroup.unshift(parsedMainStore)
      return {
        storeGroup,
      }
    }

    const storeGroup = await this.storeService.getStoreGroup(url)

    //if there is a storeGroup that contains parameter store (url) in its stores array
    if (storeGroup){
      return {
        storeGroup,
      }
    }

    //parameter store is not filial of any other store
    else if (!mainStore) {
      throw new StoreNotFoundException()
    }
  }

  @Get('/:storeId')
  public async index(@Param('storeId') storeId: string) {
    const store = await this.storeService.getStore(storeId)

    if (!store) {
      throw new StoreNotFoundException()
    }

    return {
      store,
    }
  }

  @Put('/pwainstallation')
  public async storeAppInstall(@Req() request: ApiRequest, @Body() body: {userAgent: string, tenant: string}) {
    try {
      const { userAgent, tenant }  = body
      const clientIP = request.headers['x-forwarded-for'] || request.connection.remoteAddress
      const instalationData = {
        clientIP: clientIP.toString(),
        userAgent: userAgent,
      }
      const storeInstallation = await this.storeService.storeInstallationData(instalationData, tenant)
      return storeInstallation
    } catch (error) {
      console.error(error)
      return{
        error: 'internal_server_error',
      }
    }
  }
}
