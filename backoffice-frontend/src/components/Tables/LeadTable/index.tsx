import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Field, FieldProps } from 'formik'
import { DeleteOutlined } from '@material-ui/icons'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles, Link as MuiLink, TablePagination } from '@material-ui/core'
import { format } from 'date-fns'
import ptBR from 'date-fns/esm/locale/pt-BR/index.js'

import { LeadConsumer } from '../../../context/LeadContext'

import Pagination from '../../../interfaces/pagination'
import Lead from '../../../interfaces/Lead'

import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  leads: Lead[]
  pagination?: Pagination
}

class LeadTable extends Component<Props> {
  render() {
    const { leads, pagination } = this.props
    return (
      <LeadConsumer>
        {({ getLeads, deleteLead }) => (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>SDR Responsável</TableCell>
                  <TableCell>Cadastrado em</TableCell>
                  <TableCell />
                </TableHead>
                <TableBody>
                  {leads.map((lead: Lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>
                        <MuiLink component={Link} to={`/leads/${lead._id}`}>
                          {lead.name}
                        </MuiLink>
                      </TableCell>
                      <TableCell>
                        {lead.email}
                      </TableCell>
                      <TableCell>
                        {lead.sdr.name}
                      </TableCell>
                      <TableCell>
                        {lead.createdAt
                          ? format(new Date(lead.createdAt), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })
                          : null
                        }
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={async () => {
                            await deleteLead(lead._id!)
                            await getLeads({ page: pagination!.currentPage })
                          }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pagination && (
                <Field name='limit'>
                  {({ form }: FieldProps) => (
                    <TablePagination
                      count={pagination.total}
                      page={pagination.currentPage - 1}
                      rowsPerPageOptions={[20, 50, 100]}
                      onChangeRowsPerPage={(e) => {
                        form.setFieldValue('limit', e.target.value)
                        form.submitForm()
                      }}
                      onChangePage={(e, page) => {
                        form.setFieldValue('page', page + 1)
                        form.submitForm()
                      }}
                      rowsPerPage={pagination.limit}
                      component='div'
                    />
                  )}
                </Field>
              )}
            </TableContainer>
          </>
        )}
      </LeadConsumer>
    )
  }
}

export default withStyles(styles)(LeadTable)
