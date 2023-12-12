import { Box, Button, Grid, Typography } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import StoreUrls from '../../../interfaces/storeUrls'
import StoreUrlsForm from '../../Forms/StoreUrlsForm'
import PaperBlock from '../../PaperBlock'

import * as yup from 'yup'
import SuportLink from '../../SuportLink'
import { isEqual } from 'lodash'

interface Props extends RouteComponentProps {
  mode: any
  classes: any
  mainStore: boolean
  onSuccess: boolean
  available: boolean
  storeUrls: StoreUrls[]
  onEdit: (data: any) => void
  loadStoreUrls: () => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
}

class StoreBranchPaper extends Component<Props> {
  static defaultProps = {
    mainStore: false,
    onSuccess: false,
    available: false,
    storeUrls: [],
  }

  onLoad = () => {
    const { loadStoreUrls } = this.props
    loadStoreUrls()
  }

  componentDidMount() {
    this.onLoad()
  }

  validationSchema = yup.object().shape({
    storeUrls: yup.array().of(
      yup.object().shape({
        url_name: yup.string().required('Nome da filial é obrigatório !'),
        url_address: yup.string().required('A url da filial é obrigatório !').url('Digite uma url válida !'),
      })
    ),
  })

  handleEdit = (data: any) => {
    const { onEdit, onSuccess, openSnackbar } = this.props
    onEdit(data)

    if (onSuccess) {
      openSnackbar('Urls Alterados com sucesso !')
      setTimeout(() => {
        this.onLoad()
      }, 1500)
    } else {
      openSnackbar('Ocorreu um erro tente novamente !')
    }
  }

  render() {
    const { classes, mainStore, storeUrls, available } = this.props

    return (
      <div>
        <PaperBlock title="Urls de Redirecionamento por Popup">
          {!available && (
            <div>
              <Typography>Opcão de Redirecionamento já definida</Typography>
            </div>
          )}
          {!mainStore && (
            <div>
              <Typography>Funcionalidade disponível apenas para a Farmácia Matriz.</Typography>
            </div>
          )}

          {mainStore && available && (
            <Formik
              validationSchema={this.validationSchema}
              onSubmit={this.handleEdit}
              initialValues={{ storeUrls }}
              enableReinitialize
            >
              {({ values, isValid, initialValues }) => {
                return (
                  <Form>
                    <StoreUrlsForm />
                    <Box mt={2}>
                      <Grid container spacing={2}>
                        <Grid item>
                          <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            classes={{ root: classes.buttonsave }}
                            disabled={!isValid || isEqual(values, initialValues) || !available}
                          >
                            Salvar
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box mt={2}>
                      <SuportLink query="urls de filiais" />
                    </Box>
                  </Form>
                )
              }}
            </Formik>
          )}
        </PaperBlock>
      </div>
    )
  }
}

export default StoreBranchPaper
