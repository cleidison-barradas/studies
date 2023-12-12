import { IShippingPackage } from '../../../../interfaces/shipping'

export function getShippingPackage(packages: IShippingPackage[]) {

  return packages.map(_package => {

    const height = _package.dimensions.height
    const width = _package.dimensions.width
    const length = _package.dimensions.length
    const weight = _package.weight

    return {
      height,
      width,
      length,
      weight
    }

  })
}
