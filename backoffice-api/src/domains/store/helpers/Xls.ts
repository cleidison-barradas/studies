import XLSX from 'xlsx'

export const build = (data: any[], workSheetName: string): Buffer => {
    const workbook = XLSX.utils.book_new()
    const content = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, content, workSheetName)
  
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  }