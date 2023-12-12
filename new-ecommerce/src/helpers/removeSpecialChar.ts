export function removeSpecialChar(str: string) {
  let newString = str
  newString = newString.replace(/[ÀÁÂÃÄÅ]/, 'A')
  newString = newString.replace(/[àáâãäå]/, 'a')
  newString = newString.replace(/[ÈÉÊË]/, 'E')
  newString = newString.replace(/[Ç]/, 'C')
  newString = newString.replace(/[ç]/, 'c')

  // o resto

  return newString.replace(/[^a-z0-9]/gi, '')
}
