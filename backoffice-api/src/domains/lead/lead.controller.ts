import {
  ApiRequest,
  AuthHandlerMiddleware,
  Body,
  Delete,
  Get,
  JsonController,
  ObjectID,
  ORM,
  Param,
  Post,
  Put,
  QueryParams,
  Req,
  Res,
  Lead,
  UseBefore,
} from '@mypharma/api-core'
import { Response } from 'express'
import XLSX from 'xlsx-js-style'

import { IGetLeadRequest, IPostLeadRequest, LeadsReportRequest } from './interface/lead.request'

import getLeadsAndCountService from './services/LeadGet.service'
import getLeadByIdService from './services/LeadGetById.service'
import softDeleteLeadService from './services/LeadDelete.service'
import updateLeadStatusService from './services/LeadUpdateStatus.service'
import leadsPostReportService from './services/LeadGenerateReport.service'
import { put } from '../../services/aws'

const { DATABASE_INTEGRATION_NAME } = process.env

@JsonController('/v1/leads')
@UseBefore(AuthHandlerMiddleware)
export default class LeadController {
  @Get()
  async getLeads(@Res() response: Response, @Req() request: ApiRequest, @QueryParams() query: IGetLeadRequest): Promise<unknown> {
    const { limit = 20, page = 1 } = query

    try {
      const [leads, total] = await getLeadsAndCountService(query)

      return response.json({ leads, limit: Number(limit), currentPage: Number(page), total })
    } catch (error) {
      console.error(error)
      return response.status(500).json({ error })
    }
  }

  @Get('/:id')
  async getLead(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      const lead = await getLeadByIdService(id)

      return response.json({ lead })
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }

  @Delete('/:id')
  async deleteLead(@Res() response: Response, @Param('id') id: string): Promise<string | unknown> {
    try {
      await softDeleteLeadService(id)

      return response.json({
        deletedId: id
      })

    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }

  @Post()
  async getLeadsReport(@Res() response: Response, @QueryParams() query: LeadsReportRequest) {
    try {
      await ORM.setup(null, DATABASE_INTEGRATION_NAME)

      const [leads] = await getLeadsAndCountService(query, true)

      const title = 'Relatório de Leads Cadastrados'

      if (leads.length > 0) {
        const workbook = await leadsPostReportService(leads, query, title)
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

        const { Location: report } = await put(`backoffice/leads_reports/${title}.xlsx`, {
          content: buffer,
          name: title,
          type: 'xlsx',
          url: `backoffice/leads_reports/${title}.xlsx`
        })

        return response.json({
          report
        })
      } else {
        return response.status(400).json({
          error: 'not_have_leads_with_these_proprieties'
        })
      }

    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }

  @Put('/')
  async updateLead(@Res() response: Response, @Body() body: IPostLeadRequest): Promise<Lead | unknown> {
    const { _id, status } = body

    try {
      await updateLeadStatusService(_id, status)

      const sdr = await getLeadByIdService(_id)
      return response.json({
        sdr
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
