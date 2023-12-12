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

export function validateCPF (cpf: string) {
    const stripped = strip(cpf)

    if (!stripped) {
      return false
    }

    if (stripped.length !== 11) {
      return false
    }

    if (BLACKLIST.indexOf(stripped) !== -1) {
      return false
    }

    let numbers = stripped.substring(0, 9)
    numbers += verifierDigit(numbers)
    numbers += verifierDigit(numbers)

    return numbers.substring(-2) === stripped.substring(-2)
}

export function formatCPF (cpf: string): string {
    const cleaned = ('' + cpf).replace(/\D/g, '')
    const match = cleaned.match(/(\d{3})(\d{3})(\d{3})(\d{2})$/)
    if(match){
        return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return cpf
}

const verifierDigit = (digits: string) => {
    const numbers = digits.split('').map(number => {
        return parseInt(number, 10)
    })

    const modulus = numbers.length + 1
    const multiplied = numbers.map((number, index) => number * (modulus - index))
    const mod = multiplied.reduce((buffer, number) => buffer + number) % 11

    return (mod < 2 ? 0 : 11 - mod)
}

const strip = (number: string) => {
    return (number || '').replace(/\D/g, '')
}
