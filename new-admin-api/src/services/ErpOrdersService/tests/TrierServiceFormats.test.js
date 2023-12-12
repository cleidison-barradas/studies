const { parseCpf, parseNumbers, trimString, formatPhoneNumber } = require('../TrierService.js')

describe('parseCpf', () => {
  test('returns correctly formatted CPF', () => {
    const cpf = '12345678900'
    const formattedCpf = parseCpf(cpf)
    expect(formattedCpf).toBe('123.456.789-00')
  })

  test('returns correctly formatted CPF by removing whitespace', () => {
    const cpf = '  12345678900  '
    const formattedCpf = parseCpf(cpf)
    expect(formattedCpf).toBe('123.456.789-00')
  })
})

describe('parseNumbers', () => {
  test('returns only the numbers from the phone number', () => {
    const phoneNumber = '(12) 3456-7890'
    const numbersOnly = parseNumbers(phoneNumber)
    expect(numbersOnly).toBe('1234567890')
  })

  test('returns only the numbers from the phone number by removing special characters', () => {
    const phoneNumber = '+12-34-567890'
    const numbersOnly = parseNumbers(phoneNumber)
    expect(numbersOnly).toBe('1234567890')
  })
})

describe('trimString', () => {
  test('returns the original string within the character limit', () => {
    const value = 'Hello, World!'
    const truncatedValue = trimString(value, 15)
    expect(truncatedValue).toBe('Hello, World!')
  })

  test('returns the truncated string when exceeding the character limit', () => {
    const value = 'Lorem ipsum dolor sit amet'
    const truncatedValue = trimString(value, 10)
    expect(truncatedValue).toBe('Lorem ipsu')
  })

  test('returns an empty string if the value is null', () => {
    const value = null
    const truncatedValue = trimString(value, 5)
    expect(truncatedValue).toBe('')
  })
})


describe("formatPhoneNumber", () => {
  it("formats phone number with 10 digits", () => {
    const phoneNumber = "1234567890"
    const formattedNumber = formatPhoneNumber(phoneNumber)
    expect(formattedNumber).toEqual("12 3456-7890")
  })

  it("formats phone number with 11 digits", () => {
    const phoneNumber = "12345678901"
    const formattedNumber = formatPhoneNumber(phoneNumber)
    expect(formattedNumber).toEqual("12 3 4567-8901")
  })

  it("returns same number for already formatted phone number", () => {
    const phoneNumber = "12 3456-7890"
    const formattedNumber = formatPhoneNumber(phoneNumber)
    expect(formattedNumber).toEqual("12 3456-7890")
  })

  it("returns number as-is for invalid phone number", () => {
    const phoneNumber = "123abc456def"
    const formattedNumber = formatPhoneNumber(phoneNumber)
    expect(formattedNumber).toEqual("123456")
  })
})