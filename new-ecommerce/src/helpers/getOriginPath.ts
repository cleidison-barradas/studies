

export function getOriginPath() {

  const path = window.location.href.indexOf('?q=') !== -1 ? 'search' :
    window.location.href.indexOf('departamentos') !== -1 ? 'categories' : 'showcase'

  return path
}
