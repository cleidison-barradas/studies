export const isDev = () => {
  return process.env.NODE_ENV ? process.env.NODE_ENV === 'development' : false
}
