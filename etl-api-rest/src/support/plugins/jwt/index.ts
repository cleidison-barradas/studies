import fs from 'fs/promises'
import path from 'path'
import { verify } from 'jsonwebtoken'

// RSA Keys
const publicKey = path.join(__dirname, '../../../../', 'keys', 'public.key')

interface TokenPayload {
  user_id: number,
  email: string
}

export const verifyToken = async (token: string) => {
  const raw = await fs.readFile(publicKey, { encoding: 'utf8' })
  
  try {
    return verify(token, raw, {
      issuer: 'MyPharma',
      subject: 'comercial@mypharma.net.br',
      audience: 'https://www.mypharma.com.br/',
      algorithms: ['RS256']
    }) as TokenPayload
  } catch {
    return null
  }
}
