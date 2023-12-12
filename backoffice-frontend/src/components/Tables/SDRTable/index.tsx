import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Field, FieldProps } from 'formik'
import { DeleteOutlined } from '@material-ui/icons'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles, Link as MuiLink, TablePagination } from '@material-ui/core'

import { SDRConsumer } from '../../../context/SDRContext'

import Pagination from '../../../interfaces/pagination'
import SDR from '../../../interfaces/SDR'

import styles from './styles'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
  sdrs: SDR[]
  pagination?: Pagination
}

class SDRTable extends Component<Props> {
  render() {
    const { sdrs, pagination, classes } = this.props
    return (
      <SDRConsumer>
        {({ getSDRs, deleteSDR }) => (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Pode receber emails?</TableCell>
                  <TableCell />
                </TableHead>
                <TableBody>
                  {sdrs.map((sdr: SDR) => (
                    <TableRow key={sdr._id}>
                      <TableCell>
                        <MuiLink component={Link} to={`/sdrs/${sdr._id}`}>
                          {sdr.name}
                        </MuiLink>
                      </TableCell>
                      <TableCell>{sdr.email}</TableCell>
                      {sdr.willReceveLeadsEmail === true ? <TableCell className={classes.true}>Sim</TableCell> : <TableCell className={classes.false}>Não</TableCell>}
                      <TableCell>
                        <IconButton
                          onClick={async () => {
                            await deleteSDR(sdr._id!)
                            await getSDRs({ page: pagination!.currentPage })
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
                <Field name="limit">
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
                      component="div"
                    />
                  )}
                </Field>
              )}
            </TableContainer>
          </>
        )}
      </SDRConsumer>
    )
  }
}

export default withStyles(styles)(SDRTable)
