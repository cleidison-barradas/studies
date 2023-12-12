import React, { Component, VoidFunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import EditCategoryPaper from '../../components/Papers/EditCategoryPaper'
import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'
import { SnackbarConsumer } from '../../context/SnackbarContext'
import customerxService from '../../services/customerx.service'

interface CategoryRouterProps {
  categoryId: string
}

interface Props extends RouteComponentProps<CategoryRouterProps> {
  mode: any
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => VoidFunctionComponent
}

class EditCategory extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const {
      mode,
      history,
      match: {
        params: { categoryId },
      },
    } = this.props

    return (
      <SnackbarConsumer>
        {({ openSnackbar }) => (
      <CategoryProvider>
        <CategoryConsumer>
          {({ getCategorys, getCategoryDetail, requestAlterCategory, fetching, success, category, categorys }) => {
            if (categoryId) {
              return (
                <EditCategoryPaper
                  mode={mode}
                  history={history}
                  fetching={fetching}
                  onSuccess={success}
                  category={category}
                  categories={categorys}
                  categoryId={categoryId}
                  openSnackbar={openSnackbar}
                  onEdit={requestAlterCategory}
                  loadCategories={getCategorys}
                  loadCategory={getCategoryDetail}
                />
              )
            }
          }}
        </CategoryConsumer>
      </CategoryProvider>
      )}
      </SnackbarConsumer>
    )
  }
}

export default EditCategory
