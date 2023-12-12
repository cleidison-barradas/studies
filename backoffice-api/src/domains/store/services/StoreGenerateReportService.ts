import XLSX from 'xlsx-js-style'
import { Store } from '@mypharma/api-core'
import { format } from 'date-fns'

export async function generateReport(storeOrdersNumber: Map<string, number>, stores: Store[] ,orderLimit?: number, startDate?: Date, endDate?: Date ): Promise<XLSX.WorkBook> {
  if (storeOrdersNumber.size > 0) {
    const workbook = XLSX.utils.book_new()
    workbook.SheetNames.push('Relatório de Lojas')

    const data = []

    const heading = ['Relatório de Lojas']

    data.push(heading)

    const subHeading = ['']
    const subHeading2 = ['']

    if (startDate && endDate) {
      const start = format(new Date(startDate), 'dd/MM/yyyy')
      const end = format(new Date(endDate), 'dd/MM/yyyy')
      subHeading[0] = `Lojas criadas entre ${start} - ${end}.`
      data.push(subHeading)
    }

    if (startDate && !endDate) {
      const start = format(new Date(startDate), 'dd/MM/yyyy')
      const end = format(new Date(), 'dd/MM/yyyy')
      subHeading[0] = `Lojas criadas entre ${start} - ${end}.`
      data.push(subHeading)
    }

    if (!startDate && endDate) {
      const end = format(new Date(endDate), 'dd/MM/yyyy')
      subHeading[0] = `Lojas criadas até ${end}.`
      data.push(subHeading)
    }

    if (!startDate && !endDate) {
      subHeading[0] = `Todas as lojas da MyPharma.`
      data.push(subHeading)
    }

    if (orderLimit) {
      subHeading2[0] = `Lojas com menos de ${orderLimit} pedidos.`
      data.push(subHeading2)
    }

    const columnNames = ['Nome', 'Tenant', 'Quantidade de Pedidos', 'Criada em']

    data.push(columnNames)

    const filterLocation = data.length

    stores.map(_store => {
      if (storeOrdersNumber.has(_store.tenant)) {
        const row = [`${_store.name}`, `${_store.tenant}`, `${storeOrdersNumber.get(_store.tenant) || 0}`, `${format(new Date(_store.createdAt), 'dd/MM/yyyy')}`]
        data.push(row)
      }
    })

    const worksheet = XLSX.utils.aoa_to_sheet(data)

    workbook.Sheets['Relatório de Lojas'] = worksheet

    if (!worksheet['!merges']) worksheet['!merges'] = []
    worksheet['!merges'].push(XLSX.utils.decode_range('A1:D1'))
    worksheet['!merges'].push(XLSX.utils.decode_range('A2:D2'))

    if (orderLimit) worksheet['!merges'].push(XLSX.utils.decode_range('A3:D3'))

    worksheet['!cols'] = [{ width: 30 }, { width: 25 }, { width: 20 }, { width: 20 }]

    worksheet['!autofilter'] = { ref:`A${filterLocation}:D${filterLocation}` }

    return workbook
  } else {
    console.error('does not have stores with these proprieties')
  }
}
