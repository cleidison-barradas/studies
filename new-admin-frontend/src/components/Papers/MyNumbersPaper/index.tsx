import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'
import { CircularProgress, Typography } from '@material-ui/core'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import PaperBlock from '../../PaperBlock'

import orderContext from '../../../context/OrderContext'
import stringToDate from '../../../helpers/string-to-date'
import { floatToBRL } from '../../../helpers/moneyFormat'
import { ThemeConsumer } from '../../../context/ThemeContext'
import DaysFilter from '../../DaysFilter'

type Props = {
  classes: any
}

type State = {
  selected: any
}

class MyNumbersPaper extends Component<Props, State> {
  static contextType = orderContext
  context!: React.ContextType<typeof orderContext>
  constructor(props: any) {
    super(props)

    this.state = {
      selected: '30daysAgo',
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange(selected: string) {
    this.setState(
      {
        ...this.state,
        selected,
      },
      () => {
        this.load()
      }
    )
  }

  load = () => {
    const { getStatistics } = this.context
    const { selected } = this.state
    getStatistics(stringToDate(selected))
  }

  componentDidMount() {
    this.load()
  }

  render() {
    const { classes } = this.props
    const { selected } = this.state
    const { statistics, fetching } = this.context

    return (
      <ThemeConsumer>
        {({ mode }) => (
          <PaperBlock
            title={'Veja seus números'}
            backgroundColor={mode === 'light' ? ['green', 'light'] : ['green', 'dark']}
            borderColor={mode === 'light' ? ['white', 'light'] : ['white', 'dark']}
            textColor={mode === 'light' ? ['white', 'light'] : ['white', 'dark']}
            footer={true}
            selectValue={selected}
            onChange={this.onChange}
          >
            <div className={classes.container}>
              {fetching ? (
                <>
                  <div className={classes.loadingcontainer}>
                    <CircularProgress size={80} color="secondary" />
                  </div>
                </>
              ) : (
                <>
                  <Link to="/sales" className={classNames(classes.row)}>
                    <div className={classes.space}>
                      <div>
                        <p className={classes.description}> Total de Vendas </p>
                        <h1 className={classes.value}>
                          {statistics?.valueSold ? (
                            floatToBRL(statistics.valueSold)
                          ) : (
                            <Typography className={classes.empty}>Ainda não vendeu :(</Typography>
                          )}
                        </h1>
                      </div>
                      <img src={require('../../../assets/images/whiteArrowRight.svg').default} alt="" />
                    </div>
                  </Link>
                  <Link to="/sales" className={classNames(classes.row)}>
                    <div className={classes.space}>
                      <div>
                        <p className={classes.description}> Total de pedidos</p>
                        <h1 className={classes.value}>
                          {statistics?.totalOrder ? (
                            statistics?.totalOrder
                          ) : (
                            <Typography className={classes.empty}>Ainda não tem pedidos</Typography>
                          )}
                        </h1>
                      </div>
                      <img src={require('../../../assets/images/whiteArrowRight.svg').default} alt="" />
                    </div>
                  </Link>
                  <Link to="/sales" className={classNames(classes.row)}>
                    <div className={classes.space}>
                      <div>
                        <p className={classes.description}> Ticket Médio</p>
                        <h1 className={classes.value}>
                          {statistics?.totalOrder ? (
                            floatToBRL((statistics.valueSold)/(statistics?.totalOrder))
                          ) : (
                            <Typography className={classes.empty}>Ainda não tem pedidos</Typography>
                          )}
                        </h1>
                      </div>
                      <img src={require('../../../assets/images/whiteArrowRight.svg').default} alt="" />
                    </div>
                  </Link>
                  <Link to="/customers" className={classNames(classes.row)} style={{ border: 'none' }}>
                    <div className={classes.space}>
                      <div>
                        <p className={classes.description}>Total de clientes cadastrados</p>
                        <h1 className={classes.value}>
                          {statistics?.totalCustomers ? (
                            statistics?.totalCustomers
                          ) : (
                            <Typography className={classes.empty}>Ainda não tem clientes</Typography>
                          )}
                        </h1>
                      </div>
                      <img src={require('../../../assets/images/whiteArrowRight.svg').default} alt="" />
                    </div>
                  </Link>
                </>
              )}
              <DaysFilter onChange={this.onChange} value={selected} />
            </div>
          </PaperBlock>
        )}
      </ThemeConsumer>
    )
  }
}

export default withStyles(styles)(MyNumbersPaper)
