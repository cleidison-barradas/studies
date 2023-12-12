import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'
import { ShowcaseConsumer, ShowcaseProvider } from '../../context/ShowcaseContext'
import EditShowcasePaper from '../../components/Papers/EditShowcasePaper'
import { ProductConsumer, ProductProvider } from '../../context/ProductContext'
import { SnackbarConsumer } from '../../context/SnackbarContext'
import { RouteComponentProps } from 'react-router'
import customerxService from '../../services/customerx.service'

interface MatchParams {
  id: string
}

interface Props extends RouteComponentProps<MatchParams> {
  classes: any
}

class EditShowcase extends Component<Props> {
  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const {  match, history } = this.props
    return (
      <SnackbarConsumer>
        {({ openSnackbar }) => (
          <ShowcaseProvider>
            <ShowcaseConsumer>
              {({ getShowcases, showcase, postShowcase, success }) => (
                <ProductProvider>
                  <ProductConsumer>
                    {({ getProducts, products }) => (
                      <EditShowcasePaper
                        history={history}
                        id={match.params.id}
                        getShowcase={getShowcases}
                        showcase={showcase}
                        postShowcase={postShowcase}
                        openSnackbar={openSnackbar}
                        success={success}
                      />
                    )}
                  </ProductConsumer>
                </ProductProvider>
              )}
            </ShowcaseConsumer>
          </ShowcaseProvider>
        )}
      </SnackbarConsumer>
    )
  }
}

export default withStyles(style)(EditShowcase)
