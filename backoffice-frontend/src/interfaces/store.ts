import Plan from './plan'
import Pmc from './pmc'
import StoreSettings from './storeSettings'

export default interface Store {
    _id?: string
    external_id?: number
    name: string
    url: string
    pmc: Pmc | null,
    plan: Plan | null
    mainStore?: boolean
    affiliateStores: Store[]
    tenant: string
    PMC_id?: number
    settings: StoreSettings
    updatedAt: Date
    createdAt: Date
}
