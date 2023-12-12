import {
  IconButton,
  Switch,
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
import DeleteIcon from '@material-ui/icons/Delete'
import classNames from 'classnames'
import moment from 'moment'
import { Component } from 'react'
import { DialogProps } from '../../../context/ConfirmDialogContext'
import cupomTypes from '../../../helpers/cupom-types'
import Cupom from '../../../interfaces/cupom'
import style from './style'

type Props = {
  classes: any
  cupoms: Cupom[]
  deleteCupom: any
  openDialog: (props: DialogProps) => void
  closeDialog: () => void
  getCupoms: (...args: any) => void
  postCupom: (cupom: Cupom) => void
  handleChangePage: (...args: any) => void
  handleChangeRowsPerPage: (...args: any) => void
  rowsPerPage: number
  page: number
  count: number
}

class CupomTable extends Component<Props> {
  onDelete = async (cupom: Cupom) => {
    const { deleteCupom, getCupoms, openDialog, closeDialog } = this.props
    openDialog({
      title: `Confirme para excluir cupom`,
      description: `Deseja mesmo excluir cupom ${cupom.name} ?`,
      onAccept: async () => {
        await deleteCupom(cupom._id)
        await getCupoms()
        closeDialog()
      },
      onDecline: () => closeDialog(),
    })
  }
  async onChangeStatus(cupom: Cupom) {
    const { postCupom, getCupoms } = this.props
    const newCupom: any = {}
    Object.assign(newCupom, cupom)

    newCupom.status = !newCupom.status
    await postCupom(newCupom)
    await getCupoms()
  }

  render() {
    const { classes, cupoms, rowsPerPage, page, handleChangeRowsPerPage, handleChangePage, count = 0 } = this.props
    return (
      <>
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
                >
                  Código
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tablecell,
                  }}
                >
                  Tipo de desconto
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tablecell,
                  }}
                >
                  Desconto
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tablecell,
                  }}
                >
                  Limite de Utilização
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tablecell,
                  }}
                >
                  Limite de Data
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tablecell,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  classes={{
                    root: classes.tablecell,
                  }}
                  align="right"
                >
                  Excluir
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cupoms.map((cupom: Cupom) => (
                <TableRow key={cupom._id}>
                  <TableCell
                    classes={{
                      root: classes.tablecellbody,
                    }}
                  >
                    {cupom.code}
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecellbody,
                    }}
                  >
                    {cupomTypes[cupom.type]}
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecellbody,
                    }}
                  >
                    {cupom.descountPercentage} %
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecellbody,
                    }}
                  >
                    {cupom.amount === 0 ? 'Ilimitado' : cupom.amount}
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecellbody,
                    }}
                  >
                    {cupom.initialDate && (
                      <>
                        De {moment.utc(cupom.initialDate).format('DD/MM/YYYY HH:mm:ss')} <br />
                      </>
                    )}
                    {cupom.finalDate && <>Até {moment.utc(cupom.finalDate).format('DD/MM/YYYY HH:mm:ss')}</>}
                  </TableCell>
                  <TableCell
                    classes={{
                      root: classes.tablecellbody,
                    }}
                  >
                    <div className={classNames(classes.statuscontainer, cupom.status ? classes.on : classes.off)}>
                      <Typography className={classes.statustext} color="inherit">
                        {cupom.status ? 'Ativada' : 'Desativado'}
                      </Typography>
                      <Switch color="default" checked={cupom.status} onChange={() => this.onChangeStatus(cupom)} />
                    </div>
                  </TableCell>
                  <TableCell
                    align="right"
                    classes={{
                      root: classes.tablecellbody,
                    }}
                  >
                    <IconButton onClick={() => this.onDelete(cupom)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
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
        </TableContainer>
      </>
    )
  }
}

export default withStyles(style)(CupomTable)
