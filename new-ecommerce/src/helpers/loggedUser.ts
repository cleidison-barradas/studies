export function getUserToken() {
  const auth = localStorage.getItem('@myp/auth')
  if (auth) {
    const { refreshToken } = JSON.parse(auth)
    return refreshToken
  }
}
