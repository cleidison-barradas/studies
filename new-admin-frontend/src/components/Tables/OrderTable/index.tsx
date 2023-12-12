import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
  CircularProgress,
} from '@material-ui/core'
import React, { Component } from 'react'
import OrderHistory from '../../../interfaces/historyOrderStatus'
import moment from 'moment'
import style from './style'

type Props = {
  classes: any
  fetching?: boolean
  historyStatus: OrderHistory[]
}

class OrderTable extends Component<Props> {
  render() {
    const { classes, historyStatus, fetching } = this.props

    return (
      <React.Fragment>
        {fetching ? (
          <div className={classes.fetchingcontainer}>
            <CircularProgress size={30} color="primary" />
          </div>
        ) : (
          <TableContainer>
            <Table
              classes={{
                root: classes.tableroot,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    color="primary"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                    width="25%"
                  >
                    <Typography className={classes.tableheadtxt}>Alterado</Typography>
                  </TableCell>
                  <TableCell
                    color="primary"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                    width="25%"
                  >
                    <Typography className={classes.tableheadtxt}>Comentários</Typography>
                  </TableCell>
                  <TableCell
                    color="primary"
                    width="25%"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                  >
                    <Typography className={classes.tableheadtxt}>Status</Typography>
                  </TableCell>
                  <TableCell
                    color="primary"
                    width="25%"
                    classes={{
                      root: classes.tablecellroot,
                    }}
                    align="center"
                  >
                    <Typography className={classes.tableheadtxt}>Notificado</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyStatus &&
                  historyStatus.map((history) => (
                    <TableRow key={history._id}>
                      <TableCell
                        color="primary"
                        classes={{
                          root: classes.tablecellroot,
                        }}
                        className={history.status.type?.includes('rejected') ? classes.rejectedRow : ''}
                        style={{borderRadius: '12px 0px 0px 12px'}}
                      >
                        {moment(history.createdAt).calendar()}
                      </TableCell>
                      <TableCell
                        color="primary"
                        classes={{
                          root: classes.tablecellroot,
                        }}
                        className={history.status.type?.includes('rejected') ? classes.rejectedRow : ''}
                      >
                        {history.status.type !== 'rejected_docas' && history.comments}
                      </TableCell>
                      <TableCell
                        color="primary"
                        classes={{
                          root: classes.tablecellroot,
                        }}
                        className={history.status.type?.includes('rejected') ? classes.rejectedRow : ''}
                      >
                        <div className={history.status.type === 'rejected_docas' ? classes.docasRejectedStatusText : ''}>
                          {history.status.name}
                        </div>
                        {
                          history.status.type === 'rejected_docas' && history.comments &&
                          <Typography className={classes.rejectedCommentText}>{history.comments}</Typography>
                        }
                      </TableCell>
                      <TableCell
                        color="primary"
                        classes={{
                          root: classes.tablecellroot,
                        }}
                        align="center"
                        className={history.status.type?.includes('rejected') ? classes.rejectedRow : ''}
                        style={{borderRadius: '0px 12px 12px 0px'}}
                      >
                        {history.notify ? 'Sim' : 'Não'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </React.Fragment>
    )
  }
}

export default withStyles(style)(OrderTable)
