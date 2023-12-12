import { createContext } from 'react'
import { BaseApi } from '../../config'
import GAnalytics from '../../interfaces/ganalytics'
import { getAnalytics, getEvents, getMostVistedPages, getTotalUsers, putAnalytics } from '../../services/api'
import { BaseContextProvider, BaseContextState } from '../BaseContext'

interface AnalyticsContextState extends BaseContextState {
  totalUsers: any
  mostVisitedPages: any
  mostSearchedTerms: any
  events: any
  ganalytics: GAnalytics | null
  versionAnalytics: number | null
}

interface AnalyticsContextData extends AnalyticsContextState {
  resetErrors: (...args: any) => void
  requestTotalUsers: (...args: any) => void
  requestMostVisitedPages: (...args: any) => void
  requestMostSearchedTerms: (...args: any) => void
  requestEventsClick: (...args: any) => void
  getAnalytics: (...args: any) => void
  putAnalytics: (...args: any) => void
}

const analyticsContext = createContext({} as AnalyticsContextData)
export default analyticsContext

const { Provider, Consumer } = analyticsContext

export const AnalyticsConsumer = Consumer

export class AnalyticsProvider extends BaseContextProvider {
  state: AnalyticsContextState = {
    fetching: false,
    success: false,
    error: null,
    errorObjects: null,
    deletedId: null,
    pagination: null,
    totalUsers: null,
    mostVisitedPages: null,
    mostSearchedTerms: null,
    events: null,
    ganalytics: null,
    versionAnalytics: null,
  }

  requestTotalUsers = async (startDate: string = '30daysAgo', endDate: string = 'today', isVersion4: boolean) => {
    this.startRequest(BaseApi)

    let response

    if (isVersion4) {
      response = await getTotalUsers({
        startDate,
        endDate,
        metrics: 'totalUsers',
        dimensions: 'date',
      })
    } else {
      response = await getTotalUsers({
        startDate,
        endDate,
        metrics: 'ga:users',
        dimensions: 'ga:date',
      })
    }

    this.processResponse(response)

    const { data, ok } = response

    if (ok) {
      if (isVersion4) {
        const rows: [string, string][] = data.rows.map((row: any) => [row.dimensionValues[0].value, row.metricValues[0].value])

        this.setState({
          ...this.state,
          totalUsers: {
            rows,
            totalsForAllResults: {
              'ga:users': rows.reduce((accumulator: number, currentArray: [string, string]) => {
                const value = Number(currentArray[1])
                return accumulator + value
              }, 0),
            },
          },
        })
      } else {
        this.setState({
          ...this.state,
          totalUsers: data,
        })
      }
    }

    return response
  }

  requestMostVisitedPages = async (startDate: string = '30daysAgo', endDate: string = 'today', isVersion4: boolean) => {
    this.startRequest(BaseApi)

    let response

    if (isVersion4) {
      response = await getMostVistedPages({
        startDate,
        endDate,
        sort: '-screenPageViews',
        metrics: 'screenPageViews',
        dimensions: 'pagePath',
      })
    } else {
      response = await getMostVistedPages({
        startDate,
        endDate,
        sort: '-ga:pageviews',
        metrics: 'ga:pageviews',
        dimensions: 'ga:pagePath',
      })
    }

    this.processResponse(response)

    const { ok } = response

    if (ok) {
      if (isVersion4) {
        const rows: [string, string][] = response.data.rows.map((row: any) => [
          row.dimensionValues[0].value,
          row.metricValues[0].value,
        ])

        const sortedData = rows.sort((a, b) => {
          const valueA = Number(a[1])
          const valueB = Number(b[1])

          return valueB - valueA
        })

        this.setState({
          ...this.state,
          mostVisitedPages: {
            rows: sortedData,
          },
        })
      } else {
        this.setState({
          ...this.state,
          mostVisitedPages: response.data,
        })
      }
    }

    return response
  }

  requestMostSearchedTerms = async (startDate: string = '30daysAgo', endDate: string = 'today', isVersion4: boolean) => {
    this.startRequest(BaseApi)

    let response

    if (isVersion4) {
      response = await getMostVistedPages({
        startDate,
        endDate,
        sort: '-screenPageViews',
        metrics: 'screenPageViews',
        dimensions: 'pageTitle',
      })
    } else {
      response = await getMostVistedPages({
        startDate,
        endDate,
        sort: '-ga:pageviews',
        metrics: 'ga:pageviews',
        dimensions: 'ga:pagePath',
      })
    }

    this.processResponse(response)
    const { ok } = response

    if (ok) {
      if (isVersion4) {
        const rows: [string, string][] = response.data.rows.map((row: any) => [
          row.dimensionValues[0].value,
          row.metricValues[0].value,
        ])

        const mostSearchedTerms = rows
          ?.map((value: any) => {
            if (value[0].includes('q=')) {
              return {
                term: value[0].split('q=')[1].replaceAll('+', ' '),
                timesSearched: value[1],
              }
            }
            return false
          })
          .filter((value: any) => value !== false && value.term !== '')

        this.setState({
          ...this.state,
          mostSearchedTerms,
        })
      } else {
        const mostSearchedTerms = response.data?.rows
          ?.map((value: any) => {
            if (value[0].includes('q=')) {
              return {
                term: value[0].split('q=')[1].replaceAll('+', ' '),
                timesSearched: value[1],
              }
            }
            return false
          })
          .filter((value: any) => value !== false && value.term !== '')

        this.setState({
          ...this.state,
          mostSearchedTerms,
        })
      }
    }

    return response
  }

  requestEventsClick = async (startDate: string = '30daysAgo', endDate: string = 'today', isVersion4: boolean) => {
    this.startRequest(BaseApi)

    let response

    if (isVersion4) {
      response = await getEvents({
        startDate,
        endDate,
        metrics: 'eventCount',
        dimensions: 'eventName',
      })
    } else {
      response = await getEvents({
        startDate,
        endDate,
        metrics: 'ga:totalEvents',
        dimensions: 'ga:eventAction',
      })
    }

    this.processResponse(response)

    const { ok } = response

    if (ok) {
      if (isVersion4) {
        const rows: [string, string][] = response.data.rows.map((row: any) => [
          row.dimensionValues[0].value,
          row.metricValues[0].value,
        ])

        const events: [string, string][] = rows.filter(
          (event) => event[0] === 'click' || event[0] === 'Click No Botão Do WhatsApp'
        )

        if (ok) {
          this.setState({
            ...this.state,
            events: {
              rows: events,
            },
          })
        }
      } else {
        this.setState({
          ...this.state,
          events: response.data,
          versionAnalytics: 3,
        })
      }
    }

    return response
  }

  getAnalytics = async (id?: string) => {
    this.startRequest(BaseApi)
    const response = await getAnalytics(id)
    this.processResponse(response, ['ganalytics'])
  }

  putAnalytics = async (data: GAnalytics) => {
    this.startRequest(BaseApi)
    const { ganalytics } = this.state
    const response = await putAnalytics(data, ganalytics?._id)
    this.processResponse(response, ['ganalytics'])
  }

  render() {
    const { children } = this.props
    return (
      <Provider
        value={{
          ...this.state,
          resetErrors: this.resetErrors,
          requestTotalUsers: this.requestTotalUsers,
          requestMostVisitedPages: this.requestMostVisitedPages,
          requestMostSearchedTerms: this.requestMostSearchedTerms,
          requestEventsClick: this.requestEventsClick,
          getAnalytics: this.getAnalytics,
          putAnalytics: this.putAnalytics,
        }}
      >
        {children}
      </Provider>
    )
  }
}
