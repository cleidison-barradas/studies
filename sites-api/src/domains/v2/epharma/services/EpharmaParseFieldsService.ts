import * as moment from 'moment'
import { RegisterDefaultField, RequestRegisterMemberFields } from '../../../../adapters/interfaces/epharma'

interface RequestEpharmaParseFieldsServiceDTO {
  fields: Record<string, any>
  defaultFields: RegisterDefaultField[]
}

class EpharmaParseFieldsService {
  constructor(private repository?: any) { }

  public parserFields({ fields, defaultFields = [] }: RequestEpharmaParseFieldsServiceDTO) {
    const parsed: RequestRegisterMemberFields[] = []

    defaultFields.forEach(_defaultField => {
      const fieldName = `${_defaultField.apiAlias}_${_defaultField.columnId}`
      let value = fields[fieldName]

      if (_defaultField.apiAlias === 'beneficiario_dt_fim') {

        value = ''
      }

      if (_defaultField.apiAlias === 'beneficiario_dt_inicio' || _defaultField.apiAlias === 'beneficiario_data_alteracao') {

        value = moment().format('DD/MM/YYYY')
      }

      if (_defaultField.columnId === 57) {

        value = 7
      }

      if (_defaultField.apiAlias === 'beneficiario_cpf' ||
        _defaultField.apiAlias === 'beneficiario_endereco_cep' ||
        _defaultField.apiAlias === 'beneficiario_endereco_cel' ||
        _defaultField.apiAlias === 'beneficiario_cartao_titular' ||
        _defaultField.apiAlias === 'beneficiario_cartao_usuario') {

        value = String(value).replace(/[\W_]+/g, '')
      }

      parsed.push({
        tableId: _defaultField.tableId,
        columnId: _defaultField.columnId,
        value
      })
    })

    return parsed
  }
}

export default EpharmaParseFieldsService
