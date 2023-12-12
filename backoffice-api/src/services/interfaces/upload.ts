export interface IUpload {
  name?: string
  type?: string
  url?: string
  content: Buffer
  acl?: string
}
