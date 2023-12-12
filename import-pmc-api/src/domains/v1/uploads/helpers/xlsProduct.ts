import XLS from 'xlsx'

export function xls<T>(filePath: string): Array<T> {
  const file = XLS.readFile(filePath)
  const xlsParsed: T[] = []

  if (!file) {
    throw new Error('file_not_found')
  }

  const sheetNames = file.SheetNames

  sheetNames.forEach(sheetName => {
    const xlsData = XLS.utils.sheet_to_json<T>(file.Sheets[sheetName])

    xlsParsed.push(...xlsData)
  })

  return xlsParsed
}