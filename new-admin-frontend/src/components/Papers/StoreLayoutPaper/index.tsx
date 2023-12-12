import { Box, Button, CircularProgress, Hidden, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import styles from './styles'
import Banner from '../../../interfaces/banner'
import Store from '../../../interfaces/store'
import SuportLink from '../../SuportLink'
import { Form, Formik } from 'formik'
import Iframe from 'react-iframe'
import _ from 'lodash'
import StoreLayoutForm from '../../Forms/StoreLayoutForm'
import FormikObserver from '../../Forms/FormikObserver'
import LayoutColors from '../../../interfaces/layoutColors'

type Props = {
  classes: Record<keyof ReturnType<typeof styles>, string>
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  getLayout: any
  banners: Banner[]
  history: any
  store?: Store
  mode?: any
  success?: boolean
  postLayout: (...args: any) => Promise<void>
}

type State = {
  layoutColors: LayoutColors
  deafultColors: LayoutColors
  triggerResetValues: boolean
}

class StoreLayoutPaper extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      triggerResetValues: false,
      layoutColors: {
        color: '',
        secondary: '',
        text: '',
        textHeader: '',
        textFooter: '',
      },
      deafultColors: {
        color: '#470aa4',
        secondary: '#bb0000',
        text: '#ffffff',
        textHeader: '#FDFDFE',
        textFooter: '#D5D9DD',
      },
    }
  }

  static defaultProps: Partial<Props> = {
    banners: [],
    store: {
      name: '',
      tenant: '',
      settings: {
        config_logo: undefined,
        config_navbar_color: '',
        config_secondary_color: '',
      },
    },
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      layoutColors: {
        color: this.props.store!.settings.config_navbar_color,
        secondary: this.props.store!.settings.config_secondary_color,
        text: this.props.store!.settings.config_navbar_text_color,
        textHeader: this.props.store!.settings.config_header_text_color || '#ffffff',
        textFooter: this.props.store!.settings.config_footer_text_color || '#ffffff',
      },
    })
    const { getLayout } = this.props

    getLayout()
  }

  onSubmit = async (data: any) => {
    const { openSnackbar, postLayout, success, getLayout } = this.props

    await postLayout(data)
    await getLayout()
    if (success) {
      openSnackbar('Layout atualizado com sucesso')
    }
  }

  formatColorToquery = (color: string | undefined) => {
    if (color) return color.replace('#', '')
    return ''
  }

  setComponentColor = (values: any) => {
    const newColors: LayoutColors = {
      color: '',
      secondary: '',
      text: '',
      textHeader: '',
      textFooter: '',
    }
    for (const field of Object.keys(newColors)) {
      if (values[field]) newColors[field as keyof LayoutColors] = values[field]
    }

    this.setState({
      ...this.state,
      layoutColors: {
        ...this.state.layoutColors,
        ...newColors,
      },
    })
  }

  resetColors = () => {
    this.setState({
      ...this.state,
      triggerResetValues: !this.state.triggerResetValues,
    })
  }

  render() {
    const { store, banners, classes, history } = this.props
    const {
      layoutColors: { color, secondary, text, textHeader, textFooter },
      deafultColors,
      triggerResetValues,
    } = this.state

    const urlSite = store?.url
      ? `${store?.url}?color=${this.formatColorToquery(color)}&secondary=${this.formatColorToquery(
          secondary
        )}&text=${this.formatColorToquery(text)}&textHeader=${this.formatColorToquery(
          textHeader
        )}&textFooter=${this.formatColorToquery(textFooter)}`
      : ''

    return (
      <Formik
        initialValues={{
          logo: store!.settings.config_logo,
          banners,
          color: store!.settings.config_navbar_color,
          secondary: store!.settings.config_secondary_color,
          text: store!.settings.config_navbar_text_color,
          textHeader: store!.settings.config_header_text_color || '#ffffff',
          textFooter: store!.settings.config_footer_text_color || '#ffffff',
        }}
        enableReinitialize
        onSubmit={this.onSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form
            onChange={(e: any) => {
              console.log(e.target.value)
            }}
          >
            <FormikObserver
              onChangeFunction={this.setComponentColor}
              setTriggerSetValues={this.resetColors}
              newValues={deafultColors}
              triggerSetValues={triggerResetValues}
            />
            <PaperBlock title={'Aparência da loja'} titleCentered={window.innerWidth < 500 ? true : false}>
              <div className={classes.grid}>
                <div>
                  <StoreLayoutForm store={store} history={history} plan={store?.plan} resetColors={this.resetColors} />

                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    classes={{
                      root: classes.saveButton,
                      disabled: classes.saveBtnDisabled,
                    }}
                    disabled={_.isEqual(
                      {
                        logo: store!.settings.config_logo,
                        banners,
                        color: store!.settings.config_navbar_color,
                      },
                      values
                    )}
                    type="submit"
                  >
                    {isSubmitting ? <CircularProgress color="secondary" size={20} /> : 'salvar'}
                  </Button>
                </div>
                <div className={classes.preview}>
                  <p className={classes.title}> Prévia da sua loja</p>

                  <Iframe
                    url={urlSite}
                    key={`${values.banners.length}-${values.logo}-${values.color}`}
                    className={classes.iframe}
                  />
                  <Hidden mdUp>
                    <Button
                      color="primary"
                      variant="contained"
                      classes={{
                        root: classes.saveButton,
                        disabled: classes.saveBtnDisabled,
                      }}
                      disabled={_.isEqual(
                        {
                          logo: store!.settings.config_logo,
                          banners,
                          color: store!.settings.config_navbar_color,
                        },
                        values
                      )}
                      type="submit"
                    >
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
export default withStyles(styles)(StoreLayoutPaper)
