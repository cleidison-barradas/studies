import {
  ApiRequest,
  AuthHandlerMiddleware,
  Get,
  JsonController,
  ORM,
  Post,
  QueryParams,
  Req,
  Res,
  UseBefore
} from '@mypharma/api-core'
import { Response } from 'express'
import XLSX from 'xlsx-js-style'
import IntegrationService from './integration.service'
import { IntegrationRequest, IntegrationsReportRequest } from './interfaces/integation.request'

import IntegrationGetStoreService from './services/IntegrationGetStoreService'
import IntegrationPostReport from './services/IntegrationPostReportService'
import IntegrationGetLogs from './services/IntegrationGetLogsService'
import { put } from '../../services/aws'

const integrationGetStoreService = new IntegrationGetStoreService()
const IntegrationGetLogsService = new IntegrationGetLogs()
const integrationPostReportService = new IntegrationPostReport()

const { DATABASE_INTEGRATION_NAME } = process.env

@JsonController('/v1/store/integration')
@UseBefore(AuthHandlerMiddleware)
export default class IntegrationController {
  @Get()
  async index(@Res() response: Response, @QueryParams() params: IntegrationRequest) {
    try {
      await ORM.setup(undefined, DATABASE_INTEGRATION_NAME)
      const { page = 1, limit = 50, search, status = undefined } = params

      const { integrations, total } = await integrationGetStoreService.getIntegrationInfo({ page, limit, search, status })

      return response.json({
        total,
        integrations,
        limit: Number(limit),
        currentPage: Number(page),
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }

  @Post()
  async getIntegrationReport(@Res() response: Response, @QueryParams() query: IntegrationsReportRequest) {
    const { status = null, startDate = null, endDate = null } = query

    try {
      await ORM.setup(null, DATABASE_INTEGRATION_NAME)

      const integrations = await IntegrationGetLogsService.getIntegrationLogs(startDate, endDate)

      if (integrations.length > 0) {
        const workbook = await integrationPostReportService.generateLogReport(integrations, startDate, endDate, status)
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

        const { Location: report } = await put(`backoffice/integration_reports/Relatório de Integrações.xlsx`, {
          content: buffer,
          name: 'Relatório de Integrações',
          type: 'xlsx',
          url: 'backoffice/integration_reports/Relatório de Integrações.xlsx'
        })

        return response.json({
          report
        })
      } else {
        return response.status(400).json({
          error: 'not_have_integrations_with_these_proprieties'
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
