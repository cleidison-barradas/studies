export function formatPhoneNumber(phoneNumberString: string): string {


  const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{2})(\d{4})(\d{4})$/)
  const matchCellphone = cleaned.match(/^(1|)?(\d{2})(\d{5})(\d{4})$/)

  if (match && phoneNumberString.length === 10) {
    return ['(', match[2], ') ', match[3], '-', match[4]].join('')
  }

  if (matchCellphone && phoneNumberString.length === 11) {
    const intlCode = matchCellphone[1] ? '+1 ' : ''
    return [intlCode, '(', matchCellphone[2], ')', matchCellphone[3], '-', matchCellphone[4]].join('')
  }

  return phoneNumberString
}
