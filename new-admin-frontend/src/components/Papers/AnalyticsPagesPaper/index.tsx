import { withStyles } from '@material-ui/core/styles'
import { Component } from 'react'
import styles from './styles'

import { CircularProgress } from '@material-ui/core'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import AnalyticsContext from '../../../context/AnalyticsContext'
import { ThemeConsumer } from '../../../context/ThemeContext'
import errorCodes from '../../../helpers/error-codes'
import Store from '../../../interfaces/store'
import DaysFilter from '../../DaysFilter'
import PaperBlock from '../../PaperBlock'

type Props = {
  classes: any
  store: Store
}

type State = {
  selected: string
}

class MyNumbersPaper extends Component<Props, State> {
  static contextType = AnalyticsContext
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
    const { selected } = this.state
    const { requestMostVisitedPages } = this.context
    const { store } = this.props

    let isVersion4 = null

    if (store.settings.config_analytics_id) {
      isVersion4 = store.settings.config_analytics_id.startsWith('G-')
    }
    requestMostVisitedPages(selected, 'today', isVersion4)
  }

  componentDidMount() {
    this.load()
  }

  render() {
    const { classes } = this.props
    const { selected } = this.state
    const { fetching, error, mostVisitedPages } = this.context

    return (
      <ThemeConsumer>
        {({ mode }) => (
          <PaperBlock
            title={'Páginas mais visitadas'}
            borderColor={mode === 'light' ? ['secondary', 'lighter'] : ['grey', 'primary', 'dark']}
            footer={true}
            selectValue={selected}
            onChange={this.onChange}
          >
            <div className={classes.textColorWrapper}>
              {fetching ? (
                <div className={classes.loadingcontainer}>
                  <CircularProgress size={100} />
                </div>
              ) : (
                <>
                  {mostVisitedPages && mostVisitedPages.rows?.length > 0 && (
                    <>
                      <div className={classes.row}>
                        <h1
                          style={{
                            fontSize: 14,
                          }}
                        >
                          Página
                        </h1>
                        <h1
                          style={{
                            fontSize: 14,
                          }}
                        >
                          Exibições da página
                        </h1>
                      </div>
                      <div className={classes.scroll}>
                        {mostVisitedPages.rows.map((value: any, index: any) => (
                          <div className={classNames(classes.row, classes.dashed)} key={index}>
                            <p className={classes.value}> {value[0]} </p>
                            <p className={classes.value}> {value[1]} </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {error && (
                    <div className={classes.emptyContainer}>
                      <p> {errorCodes[error]} </p>
                      <b>
                        <p>Integre sua conta no Google Analytics agora.</p>
                      </b>
                      <Link to="/marketing/integration" className={classes.link}>
                        iniciar integração
                      </Link>
                    </div>
                  )}
                </>
              )}
              <DaysFilter color="dark" onChange={this.onChange} value={selected} />
            </div>
          </PaperBlock>
        )}
      </ThemeConsumer>
    )
  }
}

export default withStyles(styles)(MyNumbersPaper)
