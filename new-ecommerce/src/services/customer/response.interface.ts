import User from "../../interfaces/user"

export interface GetUser {
  accessToken: string
  access_token: string
  refreshToken: string
  user: User
  error?: string
}

export interface PostFindAccount {
  exist: boolean
  name: string | null
}
