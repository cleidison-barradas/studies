import { IEpharmaFieldsNeedMask } from '../../../../adapters/interfaces/epharma'

const fields: IEpharmaFieldsNeedMask[] = [
  {
    name: 'beneficiario_dt_nascimento',
    mask: '99/99/9999',
    type: 'text'
  },
  {
    name: 'beneficiario_cpf',
    mask: '999.999.999.99',
    type: 'text'
  },
  {
    name: 'beneficiario_endereco_cep',
    mask: '99.999-999',
    type: 'text'

  },
  {
    name: 'beneficiario_cartao_usuario',
    mask: '999.999.999.99',
    type: 'text'
  },
  {
    name: 'beneficiario_cartao_titular',
    mask: '999.999.999.99',
    type: 'text'
  },
  {
    name: 'beneficiario_endereco_cel',
    mask: '(99) 99999-9999',
    type: 'text'
  },
  {
    name: 'beneficiario_endereco_uf',
    type: 'select'
  },
  {
    name: 'beneficiario_tp_sexo',
    type: 'select'
  },
]


export function fieldsNeedMask(name: string) {

  return fields.find(field => field.name === name)
}
