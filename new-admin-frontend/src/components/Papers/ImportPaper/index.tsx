import { Box, CircularProgress, FormControl, Grid, TextField, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import { RouteComponentProps } from 'react-router'
import ImportTable from '../../Tables/ImportTable'

import ImportData from '../../../interfaces/importData'
import ImportHistory from '../../../interfaces/importHistory'

import styles from './style'

interface Props extends RouteComponentProps {
  mode: any
  id: string
  fetching: boolean
  historyDetail: ImportHistory | null
  loadHistory: (id?: string, data?: any) => void
  classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
  search: string
  products: ImportData[]
}

class ImportPaper extends Component<Props, State> {
  static defaultProps = {
    fetching: false,
    historyDetail: null,
  }

  constructor(props: any) {
    super(props)

    this.state = {
      search: '',
      products: [],
    }
  }

  setField(field: any, value: any) {
    this.setState({
      ...this.state,
      [field]: value,
    })
  }

  componentDidMount() {
    this.onLoad()
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.historyDetail !== prevProps.historyDetail) {
      this.setState((state: any) => ({
        ...state,
        products: this.props.historyDetail?.importData.filter(item => item.action !== 'undo'),
      }))
    }
  }

  onLoad = () => {
    const { id, loadHistory } = this.props

    if (id) {
      loadHistory(id)
    }
  }

  onChangeFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event
    const { historyDetail } = this.props

    const products = historyDetail?.importData.filter(
      (item) => (item.name?.toLowerCase() === value.toLowerCase() || item.EAN === value) &&  item.action !== 'undo'
    )

    this.setState(
      (state: any) => ({
        ...state,
        [name]: value,
        products,
      }),
      () => {
        if (value.length === 0) {
          this.onLoad()
        }
      }
    )
  }

  render() {
    const { classes, fetching, historyDetail } = this.props
    const { products, search } = this.state
    return (
      <div>
        <PaperBlock title="Detalhes da Importação">
          {fetching ? (
            <div className={classes.loadingcontainer}>
              <CircularProgress size={100} />
            </div>
          ) : (
            <>
              <Box mb={1}>
                <Grid container spacing={2}>
                  <Grid item lg={5} md={5} xs={12}>
                    <FormControl variant="outlined" className={classes.formcontrol} fullWidth>
                      <TextField
                        name="search"
                        value={search}
                        autoComplete="off"
                        variant="outlined"
                        label="Procurar pelo EAN ou nome do produto"
                        onChange={this.onChangeFields}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              {historyDetail && <ImportTable products={products} module={historyDetail.module} />}
            </>
          )}
        </PaperBlock>
      </div>
    )
  }
}

export default withStyles(styles)(ImportPaper)
