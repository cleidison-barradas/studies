export function isThisDeviceRunningiOS() {
  if (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
      navigator.platform
    )
  ) {
    return true
  }
  // iPad on iOS 13
  else if (navigator.userAgent.includes('Mac') && 'ontouchend' in document) {
    return true
  } else {
    return false
  }
}
