export interface PostUser {
  firstname: string
  lastname: string
  phone: string
  email: string
  cpf?: string | null
}

export interface PostCustomer {
  firstname: string
  lastname: string
  email: string
  telephone: string
  password: string
  cpf?: string
}

export interface PostRecoverPassword {
  token: string
  password: string
}
