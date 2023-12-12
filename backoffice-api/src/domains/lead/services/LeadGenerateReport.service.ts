import { Lead } from '@mypharma/api-core'
import XLSX from 'xlsx-js-style'
import { format } from 'date-fns'

import getLeadStatus from '../helpers/getLeadStatus'

import ReportHelpers from '../helpers/reportHelpers'
import { LeadsReportRequest } from '../interface/lead.request'

const helpers = new ReportHelpers()

export default async function leadsPostReportService(leads: Lead[], query: LeadsReportRequest, title: string): Promise<XLSX.WorkBook> {
  const workbook = XLSX.utils.book_new()
  workbook.SheetNames.push(title)

  const data = []

  const heading = [title]

  data.push(heading)
  data.push(helpers.leadCreatedAtSubHeading(query, 'Leads'))
  data.push(helpers.reportCreatedAtSubHeading())
  data.push(helpers.buildColumnNames(query))

  const filterLocation = data.length

  leads.map(lead => {
    const status = getLeadStatus(lead.status)
    const createdAt = format(lead.createdAt, 'dd/MM/yyyy')
    const colaboratorIdentificator = lead.colaboratorCnpj ? lead.colaboratorCnpj : lead.colaboratorCpf

    const row = [
      `${lead.name}`,
      `${lead.storeName}`,
      `${lead.cnpj}`,
      `${lead.storePhone}`,
      `${lead.ownerPhone}`,
      `${lead.email}`,
      `${createdAt}`,
      `${lead.colaborator}`,
      `${colaboratorIdentificator}`,
      `${lead.colaboratorEmail}`,
      `${lead.colaboratorPhone}`,
      `${status}`
    ]

    if (query.sdrInfo) {
      if (lead.sdr) {
        row.push(`${lead.sdr.name}`, `${lead.sdr.email}`)
      } else {
        row.push('SDR não alocado', 'SDR não alocado')
      }
    }

    data.push(row)
  })

  const worksheet = XLSX.utils.aoa_to_sheet(data)

  workbook.Sheets[title] = worksheet

  helpers.applyStyles(worksheet, query.sdrInfo, filterLocation)

  return workbook
}
