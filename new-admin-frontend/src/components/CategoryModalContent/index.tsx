// tslint:disable: no-shadowed-variable
import React, { Component } from 'react'
import { Checkbox, InputAdornment, TextField, withStyles } from '@material-ui/core'
import { ReactComponent as GreySearchIcon } from '../../assets/images/greySearchIcon.svg'

import TreeItem from '@material-ui/lab/TreeItem/TreeItem'
import TreeView from '@material-ui/lab/TreeView/TreeView'
import Category from '../../interfaces/category'
import style from './style'

type Props = {
  selected: any[]
  classes: any
  categories: Category[]
  setCategory: (category: string) => void
  loadCategories: (data?: any) => Promise<void>
}

type State = {
  categories: Category[]
  filters: any
}

class CategoryModalContent extends Component<Props, State> {
  static defaultProps = {
    categories: []
  }

  state: State = {
    filters: {
      type: 'all',
      name: '',
      page: 0,
      limit: 20,
    },
    categories: []
  }

  async componentDidMount() {
    await this.onLoadCategories()
  }

  onLoadCategories = async (data?: any) => {
    const { loadCategories } = this.props
    const { filters } = this.state
    const requestData = data || filters
    this.setState(
      (state) => ({
        ...state,
        categories: [],
      }),
      async () => {
        await loadCategories(requestData)
      }
    )
  }

  handleChangeFilters = (field: string, value: string | string[]) => {
    const { filters } = this.state
    const newFilters = {
      ...filters,
      [field]: value,
      page: 0,
    }

    this.setState({ filters: newFilters }, async () => {
      await this.onLoadCategories({ ...newFilters, page: 1 })
    })
  }

  render() {
    const { classes, setCategory, categories } = this.props
    let count: number = 0
    const { filters } = this.state
    return (
      <React.Fragment>
        <TextField
          fullWidth
          margin="dense"
          name="category"
          variant="outlined"
          autoComplete="off"
          value={filters.name || ''}
          label={'Procurar categorias'}
          onChange={({ target }) => this.handleChangeFilters('name', target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <GreySearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <div className={classes.categorycontainer}>
          {categories.map(category => {
            count++
            return (
              <TreeView className={classes.root} key={category._id}>
                <TreeItem
                  nodeId={count.toString()}
                  label={
                    <div className={classes.childrow}>
                      <Checkbox onClick={() => {
                        if (category._id) setCategory(category._id)
                      }} />
                      {category.name}
                    </div>
                  }
                  classes={{
                    root: classes.treeitemroot,
                  }}
                />
              </TreeView>
            )
          })}
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(CategoryModalContent)
