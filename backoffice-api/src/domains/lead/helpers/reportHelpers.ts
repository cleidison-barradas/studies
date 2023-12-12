import { format } from 'date-fns'
import XLSX from 'xlsx-js-style'

import { LeadsReportRequest } from '../interface/lead.request'

import { numberToLetter } from './numberToLetter'

class ReportHelpers {
  leadCreatedAtSubHeading(query: LeadsReportRequest, object: string): string[] {
    const subHeading: string[] = ['']

    if (query.startDate && query.endDate) {
      const start = format(new Date(query.startDate), 'dd/MM/yyyy')
      const end = format(new Date(query.endDate), 'dd/MM/yyyy')

      subHeading[0] = `${object} cadastrados entre ${start} - ${end}.`
    }

    if (query.startDate && !query.endDate) {
      const start = format(new Date(query.startDate), 'dd/MM/yyyy')
      const end = format(new Date(), 'dd/MM/yyyy')

      subHeading[0] = `${object} cadastrados entre ${start} - ${end}.`
    }

    if (!query.startDate && query.endDate) {
      const end = format(new Date(query.endDate), 'dd/MM/yyyy')
      subHeading[0] = `${object} cadastrados até ${end}.`
    }

    if (!query.startDate && !query.endDate) {
      subHeading[0] = `Todos os ${object} que já foram cadastrados.`
    }

    return subHeading
  }

  reportCreatedAtSubHeading(): string[] {
    return [`Relatório criado em ${format(new Date, 'dd/MM/yyyy')}`]
  }

  buildColumnNames(query: LeadsReportRequest): string[] {
    const columnNames = ['Nome', 'Nome da Loja', 'CNPJ', 'Telefone da Loja', 'Telefone do Responsável', 'E-mail', 'Cadastrado em','Colaborador', 'CNPJ/CPF do Colaborador', 'E-mail do Colaborador', 'Telefone Celular do Colaborador', 'Status']

    if (query.sdrInfo) {
      columnNames.push('SDR Responsável', 'E-mail do SDR')
    }

    return columnNames
  }

  applyStyles(worksheet: XLSX.WorkSheet, sdrInfo: boolean, columnRange: number): void {
    worksheet['!cols'] = [{ width: 30 }, { width: 35 }, { width: 25 }, { width: 20 }, { width: 20 }, { width: 30 }, { width: 20 }, { width: 30 }, { width: 25 }, { width: 30 }, { width: 20 }, { width: 25 }]

    if (sdrInfo) {
      worksheet['!cols'].push({ width: 25 }, { width: 30 })
    }

    if (!worksheet['!merges']) worksheet['!merges'] = []

    const rowRange = numberToLetter[sdrInfo ? 14 : 12].toString()

    worksheet['!merges'].push(XLSX.utils.decode_range(`A1:${rowRange}1`))
    worksheet['!merges'].push(XLSX.utils.decode_range(`A2:${rowRange}2`))
    worksheet['!merges'].push(XLSX.utils.decode_range(`A${columnRange - 1}:${rowRange}${columnRange - 1}`))

    worksheet['!autofilter'] = { ref: `A${columnRange}:${rowRange}${columnRange}` }

    for (const cell in worksheet) {
      if (typeof (worksheet[cell]) === 'object') {
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
  }

}

export default ReportHelpers
