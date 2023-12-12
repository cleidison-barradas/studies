const { parseClient } = require('../TrierService')

describe("parseClient", () => {
    test("parses client with all fields", () => {
      const customer = {
        fullName: "John Doe",
        phone: "1234567890",
        email: "johndoe@example.com",
        cpf: "12345678901",
      }
      const cpfOrder = "98765432109"
  
      const result = parseClient(customer, cpfOrder)
  
      expect(result).toEqual({
        codigo: 1,
        nome: "John Doe",
        numeroCpfCnpj: "123.456.789-01",
        numeroRGIE: "",
        sexo: "F",
        dataNascimento: null,
        celular: "12 3456-7890",
        fone: "12 3456-7890",
        email: "johndoe@example.com",
      })
    })
  
    test("parses client with missing fields", () => {
      const customer = {
        fullName: "Jane Smith",
        phone: null,
        email: "",
        cpf: null,
      }
      const cpfOrder = "98765432109"
  
      const result = parseClient(customer, cpfOrder)
  
      expect(result).toEqual({
        codigo: 1,
        nome: "Jane Smith",
        numeroCpfCnpj: "987.654.321-09",
        numeroRGIE: "",
        sexo: "F",
        dataNascimento: null,
        celular: "",
        fone: "",
        email: "",
      })
    })
  })