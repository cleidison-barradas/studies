import { GenericObject } from '../generics/GenericObject'

export interface ApiResponse {
  status: number,
  error?: string | null,
  code?: string | null,
  message?: string | null,
  data: GenericObject
}
