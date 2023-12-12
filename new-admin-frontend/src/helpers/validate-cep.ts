export async function validateCEP(cep: string) {
  if (cep.length === 8) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json`)
    const data = await response.json()

    if (data?.erro === true) {
      return false
    }

    return data
  }
}
