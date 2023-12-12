import React, { Component } from "react"
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core"
import File from "../../../interfaces/file"

import styles from './styles'
import { BucketS3 } from "../../../config"
import moment from "moment"

interface Props {
  reports: File[]
}

class StoresReportTable extends Component<Props> {

  render() {
    const { reports } = this.props

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>Id</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Última Atualização</TableCell>
          </TableHead>
          <TableBody>
            {reports && reports.map(_report => (
              <TableRow key={_report._id}>
                <TableCell>{_report?._id}</TableCell>
                <TableCell>{
                  <Link href={new URL(`${BucketS3}/reports/${_report.key}`).href} download target='_blank' rel="noopener noreferrer">
                    Link para baixar o arquivo do relatório de GMV
                  </Link>}
                </TableCell>
                <TableCell>{moment(_report.updatedAt).format('DD/MM/YYYY: HH:mm:ss')}</TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

    )
  }
}

export default withStyles(styles)(StoresReportTable)
