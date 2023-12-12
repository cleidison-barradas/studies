import { withStyles } from '@material-ui/core/styles'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import Chart from './Chart'
import styles from './styles'

import { CircularProgress } from '@material-ui/core'
import analyticsContext from '../../../context/AnalyticsContext'
import Store from '../../../interfaces/store'
import DaysFilter from '../../DaysFilter'

type Props = {
  classes: any
  store: Store
}

type State = {
  selected: string
}

class OportunitysPaper extends Component<Props, State> {
  static contextType = analyticsContext
  context!: React.ContextType<typeof analyticsContext>

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
    const { requestEventsClick } = this.context
    const { selected } = this.state
    const { store } = this.props

    let isVersion4 = null

    if (store.settings.config_analytics_id) {
      isVersion4 = store.settings.config_analytics_id.startsWith('G-')
    }

    requestEventsClick(selected, 'today', isVersion4)
  }

  componentDidMount() {
    this.load()
  }

  render() {
    const { classes } = this.props
    const { selected } = this.state
    const { fetching, events, error, versionAnalytics } = this.context

    let rawToTitle: { [key: string]: string } = {}

    if (versionAnalytics === 3) {
      rawToTitle = {
        'Click No Botão De Telefone': 'Telefone',
        'Click No Botão Do WhatsApp': 'Whatsapp',
      }
    } else {
      rawToTitle = {
        click: 'Telefone',
        'Click No Botão Do WhatsApp': 'Whatsapp',
      }
    }

    const data =
      events && !error
        ? events.rows
            ?.filter((value: any) => {
              return rawToTitle[value[0]]
            })
            .map((value: any) => {
              return {
                name: rawToTitle[value[0]],
                value: Number(value[1]),
              }
            })
        : []

    return (
      <PaperBlock title={'Cliques nos botões WhatsApp e Telefone'}>
        <React.Fragment>
          {fetching ? (
            <div className={classes.loadingcontainer}>
              <CircularProgress size={100} />
            </div>
          ) : (
            <div className={classes.container}>
              {data ? <Chart data={data} /> : <p style={{ textAlign: 'center' }}>Ainda não teve nenhuma oportunidade de venda</p>}
              <DaysFilter color="dark" onChange={this.onChange} value={selected} />
            </div>
          )}
        </React.Fragment>
      </PaperBlock>
    )
  }
}

export default withStyles(styles)(OportunitysPaper)
