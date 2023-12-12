import { Box, Grid, Button, Typography } from '@material-ui/core'
import { Form, Formik } from 'formik'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Store from '../../../interfaces/store'
import StoreGroup from '../../../interfaces/storeGroups'
import StoreGroupForm from '../../Forms/StoreGroupForm'
import PaperBlock from '../../PaperBlock'
import SuportLink from '../../SuportLink'
import * as yup from 'yup'
import { isEqual } from 'lodash'

interface Props extends RouteComponentProps {
  mode: string
  stores: Store[]
  groups: StoreGroup[]
  mainStore: boolean
  onSuccess: boolean
  available: boolean
  onSave: (data: any) => void
  loadStoreList: () => void
  loadStoreGroups: () => void
  onDelete: (groupId: string) => void
  openSnackbar: (message: string, severity?: 'error' | 'info' | 'success' | 'warning') => void
  classes: any
}

class StoreGroupsPaper extends Component<Props> {
  static defaultProps = {
    mainStore: false,
    onSuccess: false,
    available: false,
    stores: [],
    groups: [],
  }

  onLoad = () => {
    const { loadStoreGroups, loadStoreList } = this.props
    loadStoreGroups()
    loadStoreList()
  }

  componentDidMount() {
    this.onLoad()
  }

  handleSave = (data: any) => {
    const { onSave, onSuccess, openSnackbar } = this.props
    onSave(data)

    if (onSuccess) {
      openSnackbar('Grupo criado com sucesso !')

      setTimeout(() => {
        this.onLoad()
      }, 1500)
    } else {
      openSnackbar('Ocorreu um erro tente novamente !')
    }
  }

  handleDelete = (groupId: string | null) => {
    const { onDelete, openSnackbar, onSuccess } = this.props

    if (groupId) {
      onDelete(groupId)

      if (onSuccess) {
        openSnackbar('Grupo deletado com sucesso !')

        setTimeout(() => {
          this.onLoad()
        }, 1500)
      } else {
        openSnackbar('Ocorreu um erro tente novamente !')
      }
    }
  }

  schemaValidation = yup.object().shape({
    _id: yup.string(),
    name: yup.string().required('Nome do Grupo é obrigatório'),
    stores: yup.array().min(1),
  })

  render() {
    const { classes, stores, groups, mainStore, available } = this.props

    return (
      <div>
        <PaperBlock title="Gerencie seu Grupo de Lojas e Redirecionamentos por CEP">
          {!available && mainStore && (
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
              onSubmit={this.handleSave}
              initialValues={{
                ...(groups[0] || { name: '', stores: [] }),
                groups: groups[0],
              }}
              validationSchema={this.schemaValidation}
              enableReinitialize
            >
              {({ values, isValid, initialValues }) => {
                return (
                  <Form>
                    <Box mt={2}>
                      <StoreGroupForm {...this.props} stores={stores} />
                      <Grid container spacing={2}>
                        <Grid container item xs={12} sm={6} md={8}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            classes={{ root: classes.buttonsave }}
                            disabled={!isValid || isEqual(values, initialValues) || !available}
                          >
                            Salvar
                          </Button>

                          <Button
                            type="button"
                            variant="contained"
                            disabled={groups.length > 0 ? false : true}
                            onClick={() => this.handleDelete(values._id || null)}
                            classes={{ root: classes.buttondelete }}
                          >
                            Excluir
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box mt={2}>
                      <SuportLink query="modal cep" />
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

export default StoreGroupsPaper
