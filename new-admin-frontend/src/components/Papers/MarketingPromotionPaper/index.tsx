import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Grid, Input, InputAdornment, withStyles } from '@material-ui/core'

import PaperBlock from '../../PaperBlock'

import Product from '../../../interfaces/product'
import Pagination from '../../../interfaces/pagination'

import PromotionTable from '../../Tables/PromotionTable'

import style from './style'

interface Props extends RouteComponentProps {
  mode: any
  classes: any
  fetching: boolean
  promotions: Product[]
  pagination: Pagination
  onDelete: (id: Product['_id']) => void
  loadPromotions: (id?: string, data?: any) => void
}

class MarketingPromotionPaper extends Component<Props> {
  static defaultProps = {
    fetching: false,
    promotions: [],
    pagination: {
      pages: 0,
      total: 0,
      limit: 20,
      currentPage: 1,
    },
  }

  state = {
    query: '',
  }

  getUrlSearchParams = (search: string) => {
    const { history } = this.props
    let searchObj = {}

    if (search) {
      const searchParams = new URLSearchParams(search)

      if (searchParams.has('page')) searchObj = { ...searchObj, page: searchParams.get('page') }
      if (searchParams.has('limit')) searchObj = { ...searchObj, limit: searchParams.get('limit') }
      if (searchParams.has('query')) searchObj = { ...searchObj, query: searchParams.get('query') }

      if (Object.keys(searchObj).length > 0) {
        const searchWithKeys = new URLSearchParams({ ...searchObj })

        this.setState((state) => ({
          ...state,
          query: searchParams.has('query') ? searchParams.get('query') : '',
        }))

        history.push({
          pathname: window.location.pathname,
          search: searchWithKeys.toString(),
          state: searchWithKeys.toString(),
        })
      }
    }
    return searchObj
  }
  componentDidMount() {
    const { location, loadPromotions } = this.props

    if (location && location.search) {
      loadPromotions(undefined, this.getUrlSearchParams(location.search))
    } else {
      loadPromotions()
    }
  }
  onLoad = (data?: any) => {
    const { loadPromotions } = this.props

    loadPromotions(undefined, this.getUrlSearchParams(data))
  }
  handleDelete = (id: any) => {
    const { onDelete } = this.props
    onDelete(id)

    setTimeout(() => {
      this.onLoad()
    }, 1500)
  }
  _renderProductSearch = () => {
    const { classes } = this.props
    const { query } = this.state

    return (
      <Box mt={4}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item lg={4} md={4} xs={12}>
            <Input
              fullWidth
              name="name"
              value={query}
              placeholder="Filtre por nome do produto ou EAN"
              autoComplete="off"
              onChange={(event: any) => this.onLoad({ query: event.target.value })}
              startAdornment={<InputAdornment position="start" />}
              className={classes.searchfield}
            />
          </Grid>
        </Grid>
      </Box>
    )
  }
  render() {
    const { promotions, fetching, history, pagination } = this.props
    return (
      <div>
        <PaperBlock title="Produtos em promoção">
          {this._renderProductSearch()}
          <PromotionTable
            {...this.props}
            history={history}
            fetching={fetching}
            promotions={promotions}
            pagination={pagination}
            handlePaginate={this.onLoad}
            onDelete={this.handleDelete}
          />
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(style)(MarketingPromotionPaper)