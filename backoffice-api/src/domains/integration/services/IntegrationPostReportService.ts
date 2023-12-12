import { IntegrationLog } from '@mypharma/api-core'
import { format } from 'date-fns'
import XLSX from 'xlsx-js-style'

class IntegrationPostReport {
  constructor(private repository?: any) { }

  private getLabel = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Normal'
      case 'warning':
        return 'Atenção'
      case 'problem':
        return 'Crítico'
      default:
        return 'Desconhecido'
    }
  }

  async generateLogReport(integrations: IntegrationLog[], startDate?: Date, endDate?: Date, status?: string): Promise<XLSX.WorkBook> {
    if (integrations.length > 0) {
      const workbook = XLSX.utils.book_new()
      workbook.SheetNames.push('Relatório de Integrações')

      const data = []

      const heading = ['Relatório de Integrações']

      data.push(heading)

      if (startDate && endDate) {
        const subHeading = ['']

        const start = format(new Date(startDate), 'dd/MM/yyyy')
        const end = format(new Date(endDate), 'dd/MM/yyyy')

        subHeading[0] = `Status das integrações entre ${start} - ${end}.`
        data.push(subHeading)
      }

      if (startDate && !endDate) {
        const subHeading = ['']

        const start = format(new Date(startDate), 'dd/MM/yyyy')
        const end = format(new Date(), 'dd/MM/yyyy')

        subHeading[0] = `Status das integrações entre ${start} - ${end}.`
        data.push(subHeading)
      }

      if (!startDate && endDate) {
        const subHeading = ['']

        const end = format(new Date(endDate), 'dd/MM/yyyy')
        subHeading[0] = `Status das integrações até ${end}.`

        data.push(subHeading)
      }

      if (!startDate && !endDate) {
        const subHeading = ['']

        subHeading[0] = `Todos os Status das integrações da MyPharma.`
        data.push(subHeading)
      }

      if (status) {
        const subHeading2 = ['']

        subHeading2[0] = `Clientes com a integração com o status: ${this.getLabel(status)}.`
        data.push(subHeading2)
      }

      const subHeading3 = [`Relatório criado em ${format(new Date, 'dd/MM/yyyy')}`]
      data.push(subHeading3)

      const columnNames = ['Cliente', 'Link', 'ERP', 'Data da última integração', 'Estado da integração', 'Tipo da integração']
      data.push(columnNames)

      const filterLocation = data.length

      if (status) {
        integrations.map(integration => {
          if (status === integration.status) {
            const row = [
              `${integration.storeName}`,
              `${integration.storeUrl}`,
              `${integration.erpName}`,
              `${format(new Date(integration.lastSeen), 'dd/MM/yyyy')}`,
              `${this.getLabel(integration.status)}`,
              `${integration.extras.origin}`,
            ]
            data.push(row)
          }
        })
      } else {
        integrations.map(integration => {
          const row = [
            `${integration.storeName}`,
            `${integration.storeUrl}`,
            `${integration.erpName}`,
            `${format(new Date(integration.lastSeen), 'dd/MM/yyyy')}`,
            `${this.getLabel(integration.status)}`,
            `${integration.extras.origin}`,
          ]
          data.push(row)
        })
      }

      const worksheet = XLSX.utils.aoa_to_sheet(data)

      workbook.Sheets['Relatório de Integrações'] = worksheet

      if (!worksheet['!merges']) worksheet['!merges'] = []


      worksheet['!merges'].push(XLSX.utils.decode_range('A1:F1'))
      worksheet['!merges'].push(XLSX.utils.decode_range('A2:F2'))
      if (status) worksheet['!merges'].push(XLSX.utils.decode_range('A3:F3'))
      worksheet['!merges'].push(XLSX.utils.decode_range(`A${filterLocation - 1}:F${filterLocation - 1}`))

      worksheet['!cols'] = [{ width: 30 }, { width: 35 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 25 }]

      worksheet['!autofilter'] = { ref: `A${filterLocation}:E${filterLocation}` }

      for (const cell in worksheet) {
        if (typeof(worksheet[cell]) === 'object') {
          XLSX.utils.decode_cell(cell)

          worksheet[`${cell}`].s = {
            font: {
              name: 'Raleway',
              sz: 12,
              bold: false,
              color: { rgb: 'ff000000' },
            },
            border: {
              top: {
                style: 'medium',
                color: { rgb: 'ff000000' },
              },
              bottom: {
                style: 'medium',
                color: { rgb: 'ff000000' },
              },
              left: {
                style: 'medium',
                color: { rgb: 'ff000000' },
              },
              right: {
                style: 'medium',
                color: { rgb: 'ff000000' },
              },
            }
          }
        }
      }

      return workbook
    } else {
      console.error('do not have integration log with these proprieties')
    }
  }
}

// https://gitbrent.github.io/xlsx-js-style/

export default IntegrationPostReport
