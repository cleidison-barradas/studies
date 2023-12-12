import { IPurchased, RemarketingProducts } from '../../interfaces/remarketing'

export interface IRemarketingRequest {
  purchased: IPurchased
  products: RemarketingProducts[]
}
