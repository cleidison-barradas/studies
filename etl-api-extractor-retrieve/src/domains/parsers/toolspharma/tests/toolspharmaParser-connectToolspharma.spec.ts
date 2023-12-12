import { connectToolspharma } from "../toolspharmaParser"
describe('function is working correctly', () => {
  

    test('esta conectando', () => {
      const client =  connectToolspharma("http://apiteste.nandifarma.com.br:2002")

     expect(client instanceof Object)
    })

    test('not connected!', () => {
      const client =  connectToolspharma(null)
      
      expect(client instanceof Error)
    })
  
  })
