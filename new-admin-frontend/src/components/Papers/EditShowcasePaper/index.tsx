import { Box, Button, CircularProgress, Divider, Grid, IconButton, Typography, withStyles } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { Component } from 'react'
import NewShowcase from '../../Forms/NewShowcase'
import PaperBlock from '../../PaperBlock'
import { ArrowBack } from '@material-ui/icons'
import Showcase from '../../../interfaces/showcase'
import style from './styles'
import ShowcaseEditPosition from '../../ShowcaseEditPosition'
import SuportLink from '../../SuportLink'
import ShowcaseProduct from '../../../interfaces/showcaseProduct'
import { Form, Formik } from 'formik'

type Props = {
  classes: any
  id: Showcase['_id']
  history: any
  getShowcase: (...args: any) => void
  readonly showcase: Showcase | undefined
  postShowcase: (...args: any) => void
  openSnackbar: (...args: any) => void
  success: any
}

type State = {
  showcase: Showcase
}

class EditShowcasePaper extends Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      showcase: {
        name: '',
        main: false,
        products: [],
        smart: false,
        status: true,
        smartFilters: { quantity: 5, control: false },
      },
    }
    this.load = this.load.bind(this)
    this.cancel = this.cancel.bind(this)
    this.setProducts = this.setProducts.bind(this)
  }

  load = async () => {
    const { getShowcase, id } = this.props
    await getShowcase({}, id)
    const { showcase } = this.props
    if (showcase) {
      this.setState({
        ...this.state,
        showcase,
      })
    }
  }

  setProducts(products: ShowcaseProduct[]) {
    const showcase = this.state.showcase
    if (showcase) {
      showcase['products'] = products
      this.setState({
        ...this.state,
        showcase,
      })
    }
  }

  componentDidMount() {
    this.load()
  }

  cancel() {
    this.props.history.goBack()
  }

  onFinish = async (showcase: Showcase) => {
    const { postShowcase, openSnackbar } = this.props
    await postShowcase(showcase)
    const { success } = this.props
    if (success) {
      openSnackbar('Vitrine alterada com sucesso')
    }
  }

  render() {
    const { classes } = this.props
    const { showcase } = this.state
    return (
      <Formik initialValues={showcase} enableReinitialize onSubmit={this.onFinish}>
        {({ values, isSubmitting, setFieldValue, isValid }) => (
          <Form>
            <Box mb={2}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <IconButton color="primary" onClick={this.cancel}>
                    <ArrowBack />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Button disabled={isSubmitting || !isValid} color="primary" variant="contained" type="submit">
                    {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <NewShowcase />
            <PaperBlock>
              <Box mb={3}>
                <Grid container>
                  <Grid item lg={8} xs={12}>
                    <Grid container justify="space-between" alignItems="center">
                      <Typography className={classes.title}>Organizar Produtos</Typography>
                      <Button
                        endIcon={<Delete className={classes.deleteicon} />}
                        classes={{
                          root: classes.deletebtn,
                        }}
                        onClick={() => setFieldValue('products', [])}
                      >
                        Remover todos os produtos da Vitrine
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={window.innerWidth < 1300 ? 0 : 4} justify={window.innerWidth ? 'center' : 'space-between'}>
                <Grid item lg={8} md={8} xs={12} sm={12}>
                  <ShowcaseEditPosition showcase={values} classes={classes} setProducts={this.setProducts} />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <div className={classes.paper}>
                    <Typography className={classes.papertitle}>Como organizar sua vitrine</Typography>
                    <Box mt={3} mb={3}>
                      <Divider />
                    </Box>
                    <Typography className={classes.text}>
                      Arraste e solte os produtos e ordene na sequência que deseja que apareça no seu site.
                    </Typography>
                    <Typography className={classes.text}>
                      Use o botão <Delete className={classes.deletebtn} /> para remover os produtos de forma individual da vitrine
                      do seu site.
                    </Typography>
                    <Typography className={classes.text}>
                      Siga os passos a baixo para adicionar mais produtos na vitrine do seu site.
                    </Typography>
                  </div>
                  <div className={classes.paper}>
                    <Typography className={classes.papertitle}>Quer mais produtos?</Typography>
                    <Box mt={3} mb={3}>
                      <Divider />
                    </Box>
                    <Typography className={classes.text}>
                      Caso deseje adicionar mais produtos à sua vitrine, basta clicar no botão abaixo para ser direcionado à
                      tabela de produtos.
                    </Typography>
                    <Typography className={classes.text}>
                      Assim que for direcionado à tabela, busque ou filtre os produtos que deseja e basta clicar em ”Adicionar".
                    </Typography>
                    <Box mt={5}>
                      <Button color="primary" variant="contained" onClick={() => window.scrollTo(0, 0)}>
                        quero adicionar mais
                      </Button>
                    </Box>
                  </div>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button disabled={isSubmitting || !isValid} color="primary" variant="contained" type="submit">
                  {isSubmitting ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
              </Box>
              <SuportLink query="editar vitrine" />
            </PaperBlock>
          </Form>
        )}
      </Formik>
    )
  }
}

export default withStyles(style)(EditShowcasePaper)
