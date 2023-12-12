import { Box, Button, CircularProgress, Grid, LinearProgress, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import style from './style'

import Showcase from '../../../interfaces/showcase'
import ShowcaseForm from '../../Forms/NewShowcase'
import { ManufacturerProvider } from '../../../context/ManufacturerContext'
import { CategoryProvider } from '../../../context/CategoryContext'
import { ProductProvider } from '../../../context/ProductContext'
import SuportLink from '../../SuportLink'
import ShowcaseTable from '../../Tables/ShowcaseTable'
import { Form, Formik } from 'formik'
import { ShowcaseConsumer } from '../../../context/ShowcaseContext'
import { StoreConsumer } from '../../../context/StoreContext'

type Props = {
  classes: any
  getShowcases: (data?: any, id?: Showcase['_id']) => Promise<void>
  putShowcase: (showcase: Showcase) => Promise<void>
  fetching: any
}

type State = {
  creating: boolean
}

class ShowCase extends Component<Props, State> {
  state: State = {
    creating: false,
  }

  async componentDidMount() {
    await this.load()
  }

  load = async () => {
    const { getShowcases } = this.props
    await getShowcases()
  }

  onChangeCreating = () => {
    this.setState({
      ...this.state,
      creating: !this.state.creating,
    })
  }

  onFinish = async (showcase: Showcase) => {
    const { putShowcase, getShowcases } = this.props
    await putShowcase(showcase)
    this.onChangeCreating()
    await getShowcases()
  }

  initialValue: Showcase = {
    name: '',
    products: [],
    smart: false,
    main: true,
    status: true,
    smartFilters: {
      control: false,
      quantity: 5,
    },
    smartType: 'mostSelled',
  }

  render() {
    const { classes } = this.props
    const { creating } = this.state
    return (
      <StoreConsumer>
        {({ store }) => (
          <ShowcaseConsumer>
            {({ fetching, showcases, updateShowcases }) => (
              <React.Fragment>
                <Box mb={1} hidden={!fetching}>
                  <LinearProgress />
                </Box>

                <div>
                  <PaperBlock title="Todas as vitrines">
                    {store?.settings.config_new_layout && (
                      <Box mb={2}>
                        <Typography color="textSecondary">
                          Clique e segure para arrastar a vitrine e alterar a posição que ela aparece no site
                        </Typography>
                      </Box>
                    )}
                    <ShowcaseTable updateShowcases={updateShowcases} isFetching={fetching} showcases={showcases} />
                    <Box mt={2}>
                      <SuportLink query="todas as vitrines" />
                    </Box>
                  </PaperBlock>
                </div>
                {!creating ? (
                  <Button color="primary" variant="contained" onClick={this.onChangeCreating}>
                    CRIAR NOVA
                  </Button>
                ) : (
                  <ProductProvider>
                    <CategoryProvider>
                      <ManufacturerProvider>
                        <Formik initialValues={this.initialValue} onSubmit={this.onFinish}>
                          {({ isSubmitting }) => (
                            <Form>
                              <ShowcaseForm />
                              <Box mt={3}>
                                <Grid container alignItems="center" justify="space-between">
                                  <Grid item>
                                    <Grid
                                      container
                                      spacing={2}
                                      justify={window.innerWidth < 1200 ? 'space-between' : 'flex-start'}
                                    >
                                      <Grid item>
                                        <Button
                                          classes={{
                                            root: classes.cancelbtn,
                                          }}
                                          onClick={this.onChangeCreating}
                                        >
                                          CANCELAR
                                        </Button>
                                      </Grid>
                                      <Grid item>
                                        <Button variant="contained" disabled={isSubmitting} color="primary" type="submit">
                                          {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Form>
                          )}
                        </Formik>
                      </ManufacturerProvider>
                    </CategoryProvider>
                  </ProductProvider>
                )}
              </React.Fragment>
            )}
          </ShowcaseConsumer>
        )}
      </StoreConsumer>
    )
  }
}

export default withStyles(style)(ShowCase)
