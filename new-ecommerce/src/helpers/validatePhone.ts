
const BLACKLIST = [
  '00000000000',
  '11111111111',
  '22222222222',
  '33333333333',
  '44444444444',
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999',
  '12345678909'
]

export function validatePHONE(phone?: string) {
  if (!phone) return false
  const telephone = phone?.replace(/\D+/g, "")

  if (BLACKLIST.indexOf(telephone) !== -1) {

    return false
  }

  return telephone.length === 11
}
