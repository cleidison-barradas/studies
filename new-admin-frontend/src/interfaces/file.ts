export default interface File {
  _id?: string
  name: string,
  url: string,
  key: string,
  folder: string,
  [key: string]: any
}