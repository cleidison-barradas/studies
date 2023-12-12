const {parseUserRegisterREQ} = require('../customerRegister')
require("dotenv").config();

let REQ = { body : {
    "firstname": "Conta",
    "lastname": "de Testess",
    "cpf": "044.925.310-41Z",
    "password": "123321",
    "email": "CadastroDeTeste@myPharma.com.br",
    "telephone": "(45) 98804-6579"
  }
}

describe("Parse user data to register", () => {
  let parsedUser = parseUserRegisterREQ(REQ.body)

  it("parsed email should be lowercase", async () => {
      expect(parsedUser.email).toBe('cadastrodeteste@mypharma.com.br')
  })

  it("parsed CPF should contain only numbers", async () => {
    expect(parsedUser.cpf).toBe('04492531041')
  })

  it("parsed phone should contain only numbers", async () => {
    expect(parsedUser.telephone).toBe('45988046579')
  })

  it("if cpf not informed, cpf should be empty string '' ", async () => {
    REQ.body.cpf = ''
    parsedUser = parseUserRegisterREQ(REQ.body)
    expect(parsedUser.cpf).toBe('')

    REQ.body.cpf = undefined
    parsedUser = parseUserRegisterREQ(REQ.body)
    expect(parsedUser.cpf).toBe('')

    delete REQ.body['cpf']
    parsedUser = parseUserRegisterREQ(REQ.body)
    expect(parsedUser.cpf).toBe('')

  })

})