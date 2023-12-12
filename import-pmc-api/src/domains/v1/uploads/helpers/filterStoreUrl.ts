
export function filterValidUrls(urls: string[]) {
  const validUrls = new Map<string, string>([])

  if (!urls && urls.length <= 0) return []

  urls.forEach(_url => {
    try {

      if (_url.trim().length > 0) {
        const url = new URL(_url).href

        if (!validUrls.has(url)) {

          validUrls.set(url, url)
        }
      }

    } catch (error) {
      console.log(error)
    }
  })

  const filtred = Array.from(validUrls.values())

  validUrls.clear()

  return filtred
}