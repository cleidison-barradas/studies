import * as yup from 'yup'

export const AddressValidatorBase = {
  number: yup.string(),
  neighborhood: yup.object({
    name: yup.string().required('Bairro obrigatório'),
    city: yup.object({
      name: yup.string().required(),
      state: yup.object({
        name: yup.string().required(),
      }),
    }),
  }),
  street: yup.string().required('Rua obrigatório'),
  complement: yup.string(),
  isMain: yup.bool(),
}

export const AddressValidatorRequiredCep = {
  ...AddressValidatorBase,
  postcode: yup.string().min(8, 'Cep invalido').max(9, 'Cep invalido').required('CEP obrigatório'),
}

export const AddressValidator = {
  ...AddressValidatorBase,
  postcode: yup.string().min(8, 'Cep invalido').max(9, 'Cep invalido'),
}
