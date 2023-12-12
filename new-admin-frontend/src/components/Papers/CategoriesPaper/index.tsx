import { Grid, TextField, InputAdornment, Button, Select, MenuItem } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Category from '../../../interfaces/category'
import Pagination from '../../../interfaces/pagination'
import { ReactComponent as GreySearchIcon } from '../../../assets/images/greySearchIcon.svg'
import CategoryTable from '../../Tables/CategoryTable'

import styles from './styles'

interface Props extends RouteComponentProps {
  categories: Category[]
  pagination: Pagination
  onEditing: (data: any) => void
  onDelete: (data: any) => void
  loadCategories: (data?: any) => Promise<void>
}

interface IEditing {
  ids: Category['_id'][]
  status: any
}
interface IDelete {
  ids: Category['_id'][]
}

class CategoriesPaper extends Component<Props> {
  static defaultProps = {
    categories: [],
    pagination: {
      pages: 0,
      limit: 0,
      total: 0,
      currentPage: 0,
    },
  }
  componentDidMount() {
    this.onLoad()
  }

  onLoad = () => {
    const { loadCategories } = this.props
    loadCategories()
  }

  handleDelete = ({ ids }: IDelete) => {
    this.props.onDelete({ ids })

    setTimeout(() => {
      this.onLoad()
    }, 800)
  }
  handleEdit = ({ ids, status }: IEditing) => {
    this.props.onEditing({ ids, status })

    setTimeout(() => {
      this.onLoad()
    }, 800)
  }

  filters = {
    nameFilter : '',
    typeFilter : 'all'
  }

  render() {
    const { history, categories, pagination, loadCategories } = this.props
    return (
      <div>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={12} lg={3}>
            <TextField
              fullWidth
              margin="dense"
              name="categoryName"
              autoComplete="off"
              variant="outlined"
              placeholder="Procurar categorias"
              onChange={({ target }) =>{
                this.filters.nameFilter = target.value.trim()
                loadCategories({ name: this.filters.nameFilter, type: this.filters.typeFilter })
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GreySearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            </Grid>
            <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
              <Select
                fullWidth
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue={'all'}
                label="Tipo"
                onChange={({ target }) => {
                    if (typeof target.value === 'string'){
                      this.filters.typeFilter = target.value
                      }
                      loadCategories({ name: this.filters.nameFilter, type: this.filters.typeFilter})
                  }}
              >
                <MenuItem value={'all'}>Todos</MenuItem>
                <MenuItem value={'mainCategory'}>Categoria Principal</MenuItem>
                <MenuItem value={'subCategory'}>Subcategoria</MenuItem>
              </Select>
            </Grid>
          <CategoryTable
            history={history}
            categories={categories}
            pagination={pagination}
            onDelete={this.handleDelete}
            onEditing={this.handleEdit}
            loadCategories={loadCategories}
          />
        </Grid>
        <Button variant="contained" color="primary" onClick={() => history.push('/category/add')}>
          Criar Categoria
        </Button>
      </div>
    )
  }
}
export default withStyles(styles)(CategoriesPaper)
