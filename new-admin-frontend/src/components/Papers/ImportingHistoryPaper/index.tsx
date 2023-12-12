import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import style from './style'
import ImportingHistoryTable from '../../Tables/ImportingHistoryTable'
import SuportLink from '../../SuportLink'
import ImportHistory from '../../../interfaces/importHistory'
import Pagination from '../../../interfaces/pagination'

interface Props {
  fetching: boolean
  pagination: Pagination
  onDelete: (id?: string) => void
  importHistory: ImportHistory[]
  importDetail: ImportHistory | null
  loadHistory: (id?: string, data?: any) => void
}

interface RequestDataImport {
  id?: string
  data?: any
}

class ImportingHistoryPaper extends Component<Props> {
  static defaultProps = {
    history: null,
    fetching: false,
    pagination: {
      pages: 0,
      total: 0,
      limit: 20,
      currentPage: 1,
    },
    importHistory: [],
  }

  onLoad = ({ id, data }: RequestDataImport) => {
    const { loadHistory } = this.props
    loadHistory(id, data)
  }

  componentDidMount() {
    this.onLoad({})
  }

  handleDelete = (id?: string) => {
    const { onDelete } = this.props
    onDelete(id)

    setTimeout(() => {
      this.onLoad({})
    }, 1200)
  }

  render() {
    const { fetching, importHistory, importDetail, pagination } = this.props
    return (
      <div>
        <PaperBlock title="Histórico de Importação">
          <ImportingHistoryTable
            fetching={fetching}
            pagination={pagination}
            importDetail={importDetail}
            importHistory={importHistory}
            loadDetails={this.onLoad}
            onDelete={this.handleDelete}
          />
          <SuportLink query="historico de importacao" />
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(style)(ImportingHistoryPaper)
