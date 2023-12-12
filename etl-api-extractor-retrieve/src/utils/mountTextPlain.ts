export function Mount(data: any) {
  let dataParsed = JSON.stringify(data)
  const buffer = []

  // Let's create blocks of our data, to enable easily encryption
  // Our blocks can't have more than 10k len
  if (dataParsed.length > 1000 * 10) {
    while (dataParsed.length > 0) {
      const size =
        dataParsed.length > 1000 * 10 ? 1000 * 10 : dataParsed.length

      buffer.push(dataParsed.slice(0, size))
      dataParsed = dataParsed.slice(size, dataParsed.length)
    }
  } else {
    buffer.push(dataParsed)
  }

  dataParsed = ''
  return buffer
}
