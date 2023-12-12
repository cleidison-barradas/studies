import { IEpharmaRegisterFields, RegisterDefaultField } from '../../../../adapters/interfaces/epharma'
import { fieldsNeedMask } from '../helpers/FieldsNeedMask'

interface RequestEpharmaFilterFieldsServiceDTO {
  fields: RegisterDefaultField[]
}

class EpharmaFilterFieldsService {
  constructor(private repository?: any) { }

  public filterFields({ fields = [] }: RequestEpharmaFilterFieldsServiceDTO) {
    if (!fields || fields.length <= 0) return []
    const filtred: IEpharmaRegisterFields[] = []

    fields.forEach(field => {
      const fieldMasked = fieldsNeedMask(field.apiAlias)

      const type = fieldMasked ? fieldMasked.type : 'text'
      const mask = fieldMasked ? fieldMasked.mask : undefined

      filtred.push({
        mask,
        type,
        label: field.label,
        tableId: field.tableId,
        columnId: field.columnId,
        apiAlias: field.apiAlias,
        allowedValues: field.allowedValues
      })
    })

    return filtred
  }
}

export default EpharmaFilterFieldsService
