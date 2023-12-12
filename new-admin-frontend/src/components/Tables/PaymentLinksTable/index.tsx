import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'
import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'

import moment from 'moment'

import PaymentLink from '../../../interfaces/paymentLink'
import { RequestGetPaymentLinks } from '../../../services/api/interfaces/ApiRequest'
import { ArrowRight } from '@material-ui/icons'
import Pagination from '../../../interfaces/pagination'
import LinkCell from '../../LinkCell'
import { DialogProps } from '../../../context/ConfirmDialogContext'

type Props = {
  classes: any
  paymentLinks: PaymentLink[]
  getPaymentLinks: (...args: any) => void
  handleChangePage: (...args: any) => void
  handleChangeRowsPerPage: (...args: any) => void
  rowsPerPage: number
  page: number
  pagination: Pagination
  onOpenDialogViewLink: () => void
  setSelectedPaymentLinkId: (id: string) => void
  openDialog: (props: DialogProps) => void
  closeDialog: () => void
  deletePaymentLink: (id: string) => Promise<void>
}

type State = {
  filters: RequestGetPaymentLinks
  paymentLinks: PaymentLink[]
}

class PaymentLinksTable extends Component<Props, State> {
  onLoad = async (data?: RequestGetPaymentLinks) => {
    const { getPaymentLinks } = this.props

    this.setState(
      (state) => ({
        ...state,
        paymentLinks: [],
      }),
      async () => {
        await getPaymentLinks()
      }
    )
  }

  onDelete = async (paymentLink: PaymentLink) => {
    const { deletePaymentLink, getPaymentLinks, openDialog, closeDialog } = this.props
    openDialog({
      title: `Confirme para excluir o link`,
      description: `Deseja mesmo excluir o link de pagamento?`,
      onAccept: async () => {
        await deletePaymentLink(paymentLink._id as string)
        await getPaymentLinks()
        closeDialog()
      },
      onDecline: () => closeDialog(),
    })
  }

  copyLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
  }

  openModalViewLink = (id: string | undefined) => {
    if (id) {
      const { onOpenDialogViewLink, setSelectedPaymentLinkId } = this.props
      setSelectedPaymentLinkId(id)
      onOpenDialogViewLink()
    }
  }

  render() {
    const { classes, paymentLinks, rowsPerPage, page, handleChangeRowsPerPage, handleChangePage, pagination } = this.props
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              classes={{
                root: classes.tablerow,
              }}
            >
              <TableCell
                classes={{
                  root: classes.tablecell,
                }}
                width="23%"
              >
                id
              </TableCell>
              <TableCell
                classes={{
                  root: classes.tablecell,
                }}
                width="35%"
              >
                Link
              </TableCell>
              <TableCell
                classes={{
                  root: classes.tablecell,
                }}
                width="15%"
              >
                Data de criação
              </TableCell>
              <TableCell
                classes={{
                  root: classes.tablecell,
                }}
                width="10%"
              >
                Status
              </TableCell>
              <TableCell
                classes={{
                  root: classes.tablecell,
                }}
                align="center"
              >
                Excluir
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentLinks.map((link: PaymentLink) => (
              <TableRow key={link._id}>
                <TableCell
                  classes={{
                    root: classes.tablecellbody,
                  }}
                >
                  <span className={classes.link} onClick={() => this.openModalViewLink(link._id)}>
                    {link._id} <ArrowRight />
                  </span>
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tablecellbody,
                  }}
                >
                  <LinkCell link={link.link} />
                </TableCell>

                <TableCell
                  classes={{
                    root: classes.tablecellbody,
                  }}
                >
                  {moment(link.createdAt).format('L')}
                </TableCell>

                <TableCell
                  classes={{
                    root: classes.tablecellbody,
                  }}
                >
                  <Box
                    className={classNames(
                      classes.statuscontainer,
                      moment(link.createdAt).add(1, 'days').toDate().getTime() - new Date().getTime() > 0
                        ? classes.on
                        : classes.off
                    )}
                  >
                    <Typography className={classes.statusText}>
                      {moment(link.createdAt).add(1, 'days').toDate().getTime() - new Date().getTime() > 0 ? 'Ativo' : 'Expirado'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell
                  align="center"
                  classes={{
                    root: classes.tablecellbody,
                  }}
                >
                  <IconButton onClick={() => this.onDelete(link)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.total}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage="Linhas"
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            classes={{
              actions: classes.paginationarrows,
              root: classes.paginationroot,
            }}
          />
        )}
      </TableContainer>
    )
  }
}

export default withStyles(style)(PaymentLinksTable)
