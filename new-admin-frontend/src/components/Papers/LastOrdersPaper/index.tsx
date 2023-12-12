import { CircularProgress, Hidden, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PaperBlock from '../../PaperBlock'
import styles from './styles'

import moment from 'moment'
import Notification from '../../../interfaces/notification'
import orderContext from '../../../context/OrderContext'
import { floatToBRL } from '../../../helpers/moneyFormat'
import Order from '../../../interfaces/order'

type Props = {
  classes: any
  notification: Notification | undefined
}

class LastOrdersPaper extends Component<Props> {
  static contextType = orderContext
  context!: React.ContextType<typeof orderContext>

  componentDidMount() {
    const { getOrders } = this.context
    getOrders()
  }

  render() {
    const { classes, notification } = this.props
    const { orders, fetching } = this.context
    return (
      <PaperBlock title={'Status dos últimos pedidos'}>
        {fetching ? (
          <div className={classes.loadingcontainer}>
            <CircularProgress size={100} />
          </div>
        ) : (
          <>
            {orders && orders.length > 0 ? (
              <div className={classes.overflow}>
                <table className={classes.table}>
                  <thead>
                    <tr>
                      <Hidden>
                        <th>Data</th>
                      </Hidden>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th align="right">Status</th>
                    </tr>
                  </thead>
                  <tbody className={classes.tbody}>
                    {orders.map((order: Order) => (
                      <tr key={order._id} className={classes.tr}>
                        <Hidden>
                          <td>
                            <Typography noWrap className={classes.id}>
                              {moment(order.createdAt).calendar()}
                            </Typography>
                          </td>
                        </Hidden>
                        <td>
                          {notification?.type === 'LOCKED' ? (
                            <Typography className={classes.name}>
                              {order.customer?.firstname && order.customer?.lastname
                                ? `${order.customer?.firstname} ${order.customer?.lastname}`
                                : order.customer?.email}
                            </Typography>
                          ) : (
                            <Link to={`/sale/${order._id}`} className={classes.name}>
                              {order.customer?.firstname && order.customer?.lastname
                                ? `${order.customer?.firstname} ${order.customer?.lastname}`
                                : order.customer?.email}
                            </Link>
                          )}
                        </td>
                        <td>
                          <Typography className={classes.total}>{floatToBRL(order.totalOrder)}</Typography>
                        </td>
                        <td align="right">
                          <div
                            className={classNames(classes.status)}
                            style={{ background: order.statusOrder.color || '#2480FF' }}
                          >
                            {order.statusOrder.name}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={classes.emptyContainer}>
                <h1>Sem pedidos computados</h1>
              </div>
            )}
          </>
        )}

        <hr className={classes.hr} />
        {notification?.type !== 'LOCKED' && (
          <div className={classes.buttonContainer}>
            <Link to={`/sales/list`} className={classes.button}>
              <p>Acessar lista de pedidos</p>
              <img src={require('../../../assets/images/whiteArrowRight.svg').default} alt="" />
            </Link>
          </div>
        )}
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(LastOrdersPaper)
