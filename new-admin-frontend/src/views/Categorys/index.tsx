import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Typography, withStyles, Box, LinearProgress } from '@material-ui/core'
import PaperBlock from '../../components/PaperBlock'
import CategoriesPaper from '../../components/Papers/CategoriesPaper'

import { CategoryProvider, CategoryConsumer } from '../../context/CategoryContext'

import style from './style'
import customerxService from '../../services/customerx.service'

interface Props extends RouteComponentProps {
  mode: any
  classes: any
}

class Categorys extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const { classes, history } = this.props
    return (
      <CategoryProvider>
        <CategoryConsumer>
          {({ fetching, categorys, pagination, getCategorys, requestUpdateManyCategory, requestDeleteManyCategory }) => (
            <React.Fragment>
              <Typography className={classes.headertxt}>Categorias</Typography>
              {fetching && <LinearProgress />}
              <Box mt={3}>
                <PaperBlock title="Todas as categorias">
                  <CategoriesPaper
                    {...this.props}
                    history={history}
                    categories={categorys}
                    pagination={pagination}
                    loadCategories={getCategorys}
                    onDelete={requestDeleteManyCategory}
                    onEditing={requestUpdateManyCategory}
                  />
                </PaperBlock>
              </Box>
            </React.Fragment>
          )}
        </CategoryConsumer>
      </CategoryProvider>
    )
  }
}

export default withStyles(style)(Categorys)
