import { key } from '../toolspharmaParser'

describe('function is working correctly', () => {


    test('buscando a chave do erp',  () => {
    
      const response =  key()
     expect(response).toBe("ToolsPharma")
    })
})