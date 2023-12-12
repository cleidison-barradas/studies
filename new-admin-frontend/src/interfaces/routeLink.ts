export default interface RouteLink {
  title: string
  image: string
  path: string
  sort: number
  isNew?: boolean
  roles: any[]
  exact?: boolean
  external?: string
  children?: RouteLink[]
}
