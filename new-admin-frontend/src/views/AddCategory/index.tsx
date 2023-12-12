import React, { Component } from 'react'
import { RouterProps } from 'react-router-dom'
import NewCategoryPaper from '../../components/Papers/NewCategoryPaper'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import customerxService from '../../services/customerx.service'

interface Props extends RouterProps {
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  classes: any
  mode: any
}

class AddCategory extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { mode, history, openSnackbar } = this.props
    return (
      <CategoryProvider>
        <CategoryConsumer>
          {({ requestAddCategory, getCategorys, fetching, success, categorys, category }) => (
            <NewCategoryPaper
              mode={mode}
              history={history}
              fetching={fetching}
              onSuccess={success}
              categories={categorys}
              category={category}
              openSnackbar={openSnackbar}
              onSave={requestAddCategory}
              loadCategories={getCategorys}
            />
          )}
        </CategoryConsumer>
      </CategoryProvider>
    )
  }
}

export default AddCategory
