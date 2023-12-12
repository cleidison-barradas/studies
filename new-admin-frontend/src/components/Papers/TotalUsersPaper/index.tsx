import { CircularProgress, Tooltip, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import Chart from './chart'
import styles from './styles'

import analyticsContext from '../../../context/AnalyticsContext'
import { ThemeConsumer } from '../../../context/ThemeContext'
import errorCodes from '../../../helpers/error-codes'
import PwaInstallation from '../../../interfaces/pwaInstallation'
import Store from '../../../interfaces/store'
import { getPwaInstallations } from '../../../services/api'
import DaysFilter from '../../DaysFilter'

type Props = {
  classes: any
  store: Store
}

type State = {
  selected: any
  installations: PwaInstallation[]
}

class TotalUsersPaper extends Component<Props, State> {
  static contextType = analyticsContext
  constructor(props: any) {
    super(props)
    this.state = {
      selected: '30daysAgo',
      installations: [],
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
    const { requestTotalUsers } = this.context
    const { store } = this.props
    const { selected } = this.state

    let isVersion4 = null

    if (store.settings.config_analytics_id) {
      isVersion4 = store.settings.config_analytics_id.startsWith('G-')
    }

    requestTotalUsers(selected, 'today', isVersion4)
  }

  componentDidMount() {
    this.load()
    const installations = getPwaInstallations()
    installations.then((value) => {
      if (value.ok) {
        this.setState({
          ...this.state,
          installations: value.data,
        })
      } else {
        this.setState({
          ...this.state,
          installations: [],
        })
      }
    })
  }

  filterInstallsByDate(installations: PwaInstallation[], interval: string) {
    const now = new Date()
    let startDate = new Date()

    switch (interval) {
      case '7daysAgo':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '15daysAgo':
        startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        break
      case '30daysAgo':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        // No valid date parameter, return all installations
        return installations
    }

    return installations.filter((installation) => {
      const createdAt = new Date(installation.createdAt)
      return createdAt >= startDate && createdAt <= now
    })
  }

  render() {
    const { classes } = this.props
    const { selected, installations } = this.state
    const { fetching, error, totalUsers } = this.context
    const DownloadsToolTipText = `Downloads contabilizados à partir de 15/04/2023. Total de downloads: ${installations.length}.`

    return (
      <ThemeConsumer>
        {({ mode }) => (
          <PaperBlock
            title={'Total de usuários no seu site'}
            backgroundColor={mode === 'light' ? ['purple', 'primary', 'light'] : ['purple', 'primary', 'dark']}
            borderColor={mode === 'light' ? ['white', 'light'] : ['white', 'dark']}
            textColor={mode === 'light' ? ['white', 'light'] : ['white', 'dark']}
            footer={true}
            selectValue={selected}
            onChange={this.onChange}
          >
            <div className={classes.container}>
              {error && <Typography style={{ color: 'white', textAlign: 'center' }}> {errorCodes[error]} </Typography>}
              {fetching ? (
                <div className={classes.fetchingcontainer}>
                  <CircularProgress size={100} color="secondary" />
                </div>
              ) : (
                <>
                  <div className={classes.row}>
                    {totalUsers ? (
                      <>
                        <Typography className={classes.value}>
                          {totalUsers?.totalsForAllResults && totalUsers?.totalsForAllResults['ga:users']}
                        </Typography>
                        <Typography className={classes.caption}>Acessos</Typography>
                        <Tooltip title={DownloadsToolTipText}>
                          <Typography className={classes.value}>
                            {this.filterInstallsByDate(installations, selected).length}
                          </Typography>
                        </Tooltip>
                        <Tooltip title={DownloadsToolTipText}>
                          <Typography className={classes.caption}>Downloads do App</Typography>
                        </Tooltip>
                      </>
                    ) : (
                      <Typography className={classes.empty}>Ainda não tem visitas</Typography>
                    )}
                  </div>
                  <div className={classes.userChartContainer}>
                    <Chart data={totalUsers ? totalUsers.rows : []} />
                  </div>
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

export default withStyles(styles)(TotalUsersPaper)
