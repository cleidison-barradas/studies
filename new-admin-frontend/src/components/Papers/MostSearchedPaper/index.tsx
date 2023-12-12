import { withStyles } from '@material-ui/core/styles'
import { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import styles from './styles'

import { CircularProgress } from '@material-ui/core'
import AnalyticsContext from '../../../context/AnalyticsContext'
import { ThemeConsumer } from '../../../context/ThemeContext'
import errorCodes from '../../../helpers/error-codes'
import Store from '../../../interfaces/store'
import DaysFilter from '../../DaysFilter'

type Props = {
  classes: any
  store: Store
}

type State = {
  selected: string
}

class MostSearched extends Component<Props, State> {
  static contextType = AnalyticsContext
  constructor(props: any) {
    super(props)

    this.state = {
      selected: '30daysAgo',
    }

    this.onChange = this.onChange.bind(this)
    this.load = this.load.bind(this)
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
    const { selected } = this.state
    const { requestMostSearchedTerms } = this.context
    const { store } = this.props

    let isVersion4 = null

    if (store.settings.config_analytics_id) {
      isVersion4 = store.settings.config_analytics_id.startsWith('G-')
    }
    requestMostSearchedTerms(selected, 'today', isVersion4)
  }

  componentDidMount() {
    this.load()
  }

  render() {
    const { classes } = this.props
    const { selected } = this.state
    const { mostSearchedTerms, fetching, error } = this.context

    return (
      <ThemeConsumer>
        {({ mode }) => (
          <PaperBlock
            title={'Termos mais pesquisados no seu site'}
            backgroundColor={mode === 'light' ? ['secondary', 'light'] : ['secondary', 'dark']}
            borderColor={mode === 'light' ? ['primary', 'light'] : ['primary', 'dark']}
            textColor={mode === 'light' ? ['white', 'light'] : ['white', 'dark']}
          >
            {fetching ? (
              <div className={classes.loadingcontainer}>
                <CircularProgress size={80} color="secondary" />
              </div>
            ) : (
              <>
                {mostSearchedTerms && (
                  <div className={classes.row}>
                    {mostSearchedTerms.map((value: any, index: number) => (
                      <div className={this.props.classes.searchContainer} key={index}>
                        <p className={this.props.classes.timesSearched}>{value.timesSearched}</p>
                        <p className={this.props.classes.searchTerm}>{value.term}</p>
                      </div>
                    ))}
                  </div>
                )}
                {error && (
                  <div className={classes.emptyContainer}>
                    <p> {errorCodes[error]} </p>
                    <b>
                      <p>Integre sua conta no Google Analytics agora.</p>
                    </b>
                    <a href="google.com" className={classes.link}>
                      iniciar integração
                    </a>
                  </div>
                )}
              </>
            )}
            <DaysFilter color="light" onChange={this.onChange} value={selected} />
          </PaperBlock>
        )}
      </ThemeConsumer>
    )
  }
}

export default withStyles(styles)(MostSearched)
