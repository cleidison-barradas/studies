
const BLACKLIST = [
  '00000000',
  '11111111',
  '22222222',
  '33333333',
  '44444444',
  '55555555',
  '66666666',
  '77777777',
  '88888888',
  '99999999',
  '12345678'
]

export function validateZipCode(zipcode?: string) {
  if (!zipcode || zipcode.length <= 0) return false
  const zipcodeParsed = zipcode.replace(/\D+/g, "")

  if (zipcodeParsed.length <= 0) return false

  if (BLACKLIST.indexOf(zipcodeParsed) !== -1) return false

  return true

}
