import { Box, Button, CircularProgress, Hidden, withStyles } from '@material-ui/core'
import Iframe from 'react-iframe'
import { Component } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'

import PaperBlock from '../../PaperBlock'
import SuportLink from '../../SuportLink'

import FormikObserver from '../../Forms/FormikObserver'
import TextBannerForm from '../../Forms/TextBannerForm'

import Banner from '../../../interfaces/banner'
import Store from '../../../interfaces/store'

import { styles } from './styles'

import arrowLeftIcon from '../../../assets/images/arrowLeftBlue.svg'

type Props = {
  classes: Record<keyof ReturnType<typeof styles>, string>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  updateBanner: (data: Banner) => Promise<Banner>
  banner: Banner
  store?: Store
  history?: any
  mode?: any
  success?: boolean
}

type State = {
  triggerResetValues: boolean
  loading: boolean
}

class TextBannerPaper extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      triggerResetValues: false,
      loading: false,
    }
  }

  static defaultProps: Partial<Props> = {
    banner: {},
  }

  onSubmit = async (data: Banner, { setValues }: FormikHelpers<Banner>) => {
    const { loading } = this.state

    if (!loading) {
      this.setState({
        ...this.state,
        loading: true,
      })

      const { updateBanner } = this.props

      const banner = await updateBanner(data)
      setValues(banner)

      this.setState({
        ...this.state,
        loading: false,
      })
    }
  }

  formatColorToquery = (color: string | undefined) => {
    if (color) return color.replace('#', '')
    return ''
  }

  resetColors = () => {
    this.setState({
      ...this.state,
      triggerResetValues: !this.state.triggerResetValues,
    })
  }

  render() {
    const { store, banner, classes, history } = this.props
    const { triggerResetValues, loading } = this.state

    const buttonStyles = {
      root: classes.buttonSave,
      disabled: classes.buttonDisabled,
    }

    const backIcon = (
      <img onClick={() => history.push('/store/layout')} className={classes.backIcon} src={arrowLeftIcon} alt="Voltar" />
    )

    return (
      <Formik initialValues={banner} enableReinitialize onSubmit={this.onSubmit}>
        {({ values }) => (
          <Form>
            <FormikObserver setTriggerSetValues={this.resetColors} newValues={{}} triggerSetValues={triggerResetValues} />
            <PaperBlock icon={backIcon} title="Editar banner" titleCentered={window.innerWidth < 500 ? true : false}>
              <div className={classes.grid}>
                <Box display="flex" flexDirection="column" justifyContent="space-between">
                  <TextBannerForm
                    classes={classes}
                    placeholders={banner?.placeholders}
                    history={history}
                    plan={store?.plan}
                    store={store}
                  />

                  <Button color="primary" variant="contained" fullWidth classes={buttonStyles} type="submit">
                    {loading ? <CircularProgress color="secondary" size={20} /> : 'salvar'}
                  </Button>
                </Box>
                <div className={classes.preview}>
                  <p className={classes.title}> Prévia da sua loja</p>

                  <Iframe
                    url={`${store?.url}`}
                    key={`${values?.image}-${values?.url}-${values?.description}`}
                    className={classes.iframe}
                  />
                  <Hidden mdUp>
                    <Button color="primary" variant="contained" classes={buttonStyles} type="submit">
                      salvar
                    </Button>
                  </Hidden>
                </div>
              </div>
              <Box mt={2}>
                <SuportLink query="Layout da loja" />
              </Box>
            </PaperBlock>
          </Form>
        )}
      </Formik>
    )
  }
}
export default withStyles(styles)(TextBannerPaper)
