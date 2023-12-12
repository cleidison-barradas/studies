import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  TextField,
  Divider,
  FormControl,
  withStyles,
  MenuItem,
  Chip,
  Tooltip,
} from '@material-ui/core'
import React, { Component } from 'react'
import { Autocomplete, AutocompleteRenderInputParams } from '@material-ui/lab'
import { Field, FieldArray, FieldArrayRenderProps, FieldProps } from 'formik'
import PaperBlock from '../../PaperBlock'
import { RouterProps } from 'react-router-dom'

// Icons
import { ReactComponent as GreyElipse } from '../../../assets/images/greyElipse.svg'
import { ReactComponent as GreenElipse } from '../../../assets/images/greenElipse.svg'
import { ReactComponent as CloudIcon } from '../../../assets/images/blueCloudUploader.svg'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import Base64 from '../../../helpers/to-base-64'

// Custom Fiels
import FormField from '../../TextFormField'
import SelectField from '../../SelectFormField'
import CustomConfirmDialog from '../../CustomConfirmDialog'

// Interfaces
import Category from '../../../interfaces/category'
import styles from './styles'
import CustomDropzone from '../../CustomDropzone'
import { BucketS3 } from '../../../config'

interface Props extends RouterProps {
  classes: Record<keyof ReturnType<typeof styles>, string>
  mode: any
  setFieldValue: any
  values: any
  fetching: boolean
  categories: Category[]
  loadCategories: (data: any) => void
}

type State = {
  subCategories: Category[]
  beforeChangeType: string
  setedUpbeforeChangeType: boolean
  CategoryTypeDialog: {
    open: boolean
    text: string
    onAccept: any
    onDecline: any
  }
}

class CategoryForm extends Component<Props, State> {
  static defaultProps = {
    isvalid: false,
    fetching: false,
    subCategories: [],
  }

  openChangeCategoryTypeDialog = () => {
    const { CategoryTypeDialog } = this.state

    CategoryTypeDialog.open = true
    this.setState({...this.state,CategoryTypeDialog})
  }

  declineChangeCategoryTypeDialog = () => {
    const { CategoryTypeDialog } = this.state
    CategoryTypeDialog.open = false
    this.setState({...this.state,CategoryTypeDialog})
  }

  acceptChangeCategoryTypeDialog = () => {
    let {  subCategories, beforeChangeType } = this.state
    const {CategoryTypeDialog} = this.state
    const {  values } = this.props

    if(values.parentId === '0'){// from maincategory to subcategory
      const emptyArray: any[] = []

      subCategories = []
      this.props.setFieldValue("parentId", '12')
      this.props.setFieldValue("subCategories", emptyArray)
      this.props.setFieldValue("type", "subCategory")
      this.props.setFieldValue("image", null)
      this.props.setFieldValue("position", null)
      beforeChangeType = "subCategory"
      this.setState({...this.state,subCategories,beforeChangeType})
    }
    else{// sub to maincategory
      this.props.setFieldValue("parentId", '0')
      this.props.setFieldValue("type", "mainCategory")
      beforeChangeType = "mainCategory"
      this.setState({...this.state,beforeChangeType})
    }
    CategoryTypeDialog.open = false
    this.setState({CategoryTypeDialog})
    this.setState({...this.state,CategoryTypeDialog})
  }

  state: State = {
    subCategories: [],
    beforeChangeType: '',
    setedUpbeforeChangeType: false,
    CategoryTypeDialog: {
      open: false,
      text: 'Imagem, posição e subcategorias podem ser perdidas.',
      onAccept: this.acceptChangeCategoryTypeDialog,
      onDecline: this.declineChangeCategoryTypeDialog
    }
  }

  componentDidUpdate(prevProps: any) {
    const { categories } = this.props

    if (categories && categories.length > 0 && prevProps.categories !== categories) {
      this.setState((state: any) => ({
        ...state,
        subCategories: categories.filter((category) => category.subCategories && category.subCategories.length <= 0),
      }))
    }
  }

  handleImage = async (files: any) => {
    const base64 = await Base64(files[0])

    const image = {
      url: URL.createObjectURL(files[0]),
      content: base64,
    }

    return image
  }

  render() {

    const { classes, values, loadCategories } = this.props
    const { subCategories, CategoryTypeDialog } = this.state
    let { setedUpbeforeChangeType, beforeChangeType } = this.state

    if((setedUpbeforeChangeType === false) && (values!== undefined || values !==  null)){
      if(values.name.length > 0){
      beforeChangeType = values.parentId === "0" || values.parentId === undefined ? "mainCategory" : "subCategory"
      setedUpbeforeChangeType = true
      this.setState({...this.state,setedUpbeforeChangeType,beforeChangeType})
      if(values.parentId !== '0'){
        const emptyArray: any[] = []
        this.props.setFieldValue("subCategories", emptyArray)
      }
    }
    }

    return (
      <React.Fragment>
    <CustomConfirmDialog
                    open={CategoryTypeDialog.open}
                    onAccept = {CategoryTypeDialog.onAccept}
                    onDecline={CategoryTypeDialog.onDecline}
                    onClose={CategoryTypeDialog.onDecline}
                    text={CategoryTypeDialog.text}
                    title={'Alterar o tipo da categoria?'} />
        <Grid item lg={9} md={8} xs={12}>
          <div>
            <PaperBlock title="Categoria">
              <Box mb={2}>
                <Field
                  name="name"
                  autoComplete="off"
                  label="Nome da categoria"
                  classes={{
                    root: classes.textfield,
                  }}
                  component={FormField}
                />
              </Box>
              <Typography color="textSecondary"> Imagem da categoria </Typography>
              <Tooltip title= {values.parentId  === '0' ? '' : 'Disponível somente para o tipo categoria principal'}>
                <Box mt={1} maxWidth={120} height={120}>
                  {values.parentId  === '0' ?
                    <Field name="image">
                      {({ form, field }: FieldProps) => (
                        <CustomDropzone
                          onChange={async (file) => {
                            const image = await this.handleImage(file)
                            form.setFieldValue('image', image)
                          }}
                          content={() =>
                            typeof field.value === 'string' ? (
                              <img className={classes.categoryImage} src={BucketS3 + field.value} alt="" />
                            ) : field.value?.content ? (
                              <img className={classes.categoryImage} src={field.value.url} alt="" />
                            ) : (
                              <CloudIcon />
                            )
                          }
                        />
                      )}
                    </Field>
                    :
                    <div
                      className={classes.lockedFileContainer}>
                      <CloudIcon />
                    </div>
                  }
                </Box>
              </Tooltip>
            </PaperBlock>
          </div>
          <div>
            <PaperBlock title="Pré-visualização da listagem de mecanismo de pesquisa">
              {!values.metaTitle && !values.metaDescription && !values.CategoryName && (
                <Typography className={classes.caption}>
                  Adicione um título e uma descrição para visualizar como sua categoria pode aparecer em uma listagem de mecanismo
                  de pesquisa
                </Typography>
              )}

              <Typography className={classes.metatitle}>{values.metaTitle}</Typography>
              <Typography className={classes.url}>https://suafarmacia.com.br/departamentos</Typography>
              <Typography className={classes.description}>{values.metaDescription}</Typography>

              <Box mt={3} mb={4}>
                <Divider />
              </Box>
              <Field
                label="titulo da página"
                autoComplete="off"
                name="metaTitle"
                helperText={'Tamanho maximo recomendado 70 caracteres'}
                classes={{
                  root: classes.textfield,
                }}
                component={FormField}
              />
              <Box mt={4}>
                <Field
                  name="metaDescription"
                  autoComplete="off"
                  label="Descrição"
                  helperText={'Tamanho maximo recomendado 150 caracteres'}
                  maxLength={150}
                  classes={{
                    root: classes.descriptionfield,
                  }}
                  component={FormField}
                />
              </Box>
              <Box mt={4} mb={1}>
                <TextField
                  disabled
                  required
                  fullWidth
                  name="url"
                  label={'URL'}
                  variant="outlined"
                  value={values.name ? `https://suafarmacia.com.br/departamentos/${values.name.replace(/\s/g, '-')}` : ''}
                  classes={{ root: classes.textfield }}
                  inputProps={{ maxLength: 320 }}
                />
              </Box>
            </PaperBlock>
          </div>
        </Grid>
        <Grid item lg={3} md={4} xs={12}>
          <div>
            <PaperBlock title="Status da Categoria">
              <FormControl fullWidth>
                <Field
                  classes={{
                    root: classes.select,
                  }}
                  name="status"
                  label="Status da categoria"
                  component={SelectField}
                >
                  <MenuItem value="true">Ativa</MenuItem>
                  <MenuItem value="false">Desativada</MenuItem>
                </Field>
              </FormControl>
              <Box mt={3} mb={3}>
                <Box mb={2}>
                  <Typography className={classes.statstxt}>canais de vendas e apps</Typography>
                </Box>
                <Grid alignItems="center" container spacing={2} wrap="nowrap">
                  <Grid item>{values.status && values.status.toString() === 'true' ? <GreenElipse /> : <GreyElipse />}</Grid>
                  <Grid item>
                    <Typography className={classes.sellingchanneltext}>Loja Virtual - MyPharma PRO</Typography>
                  </Grid>
                </Grid>
                <Grid alignItems="center" container wrap="nowrap" spacing={2}>
                  <Grid item>{values.status && values.status.toString() === 'true' ? <GreenElipse /> : <GreyElipse />}</Grid>
                  <Grid item>
                    <Typography className={classes.sellingchanneltext}>App MyPharma PRO</Typography>
                  </Grid>
                </Grid>
              </Box>
            </PaperBlock>
          </div>
          {values.parentId === '0' && (
            <div>
              <PaperBlock>
                <Box mb={1} style={{ gap: 8 }} display="flex" alignItems="center">
                  <Typography color="primary" style={{ fontSize: 24 }}>
                    Posição da categoria
                  </Typography>
                  <Tooltip title="Escolha a posição que a categoria ficará na homepage do seu e-commerce. Você deve digitar um número no campo abaixo. Se digitar '1', por exemplo, esta categoria será a primeira da esquerda para a direita, na fileira de categorias.">
                    <HelpOutlineIcon />
                  </Tooltip>
                </Box>
                <Field
                  name="position"
                  autoComplete="off"
                  type="number"
                  label="Posição da categoria"
                  placeholder="Posição (apenas números)"
                  classes={{
                    root: classes.textfield,
                  }}
                  component={FormField}
                />
              </PaperBlock>
            </div>
          )}
          <div>
            <PaperBlock>
            <Box mb={1} style={{ gap: 8 }} display="flex" alignItems="center">
              <Typography color="primary" style={{ fontSize: 24 }}>
                Tipo da Categoria
              </Typography>
            </Box>
              <FormControl fullWidth>
                <Field
                  classes={{
                    root: classes.select,
                  }}
                  name="type"
                  label="Tipo da categoria"
                  component={SelectField}
                  onChange= {this.openChangeCategoryTypeDialog}
                >
                  <MenuItem value="mainCategory" className={classes.menuItem}>
                    Categoria Principal
                    <Tooltip title='São exibidas na página inicial, possuem imagem e subcategorias dentro.'>
                      <HelpOutlineIcon />
                    </Tooltip>
                  </MenuItem>
                  <MenuItem value="subCategory"  className={classes.menuItem}>
                    Subcategoria
                    <Tooltip title='São exibidas dentro das categorias principais correspondentes à elas, não possuem subcategorias e imagem.'>
                      <HelpOutlineIcon />
                    </Tooltip>
                  </MenuItem>
                </Field>
              </FormControl>
            </PaperBlock>
          </div>
          <div>
          {values.parentId === '0' && (
            <PaperBlock title="Subcategorias">
              <FieldArray
                name="subCategories"
                render={({ form, push }: FieldArrayRenderProps) => (
                  <Autocomplete
                    options={subCategories}
                    renderInput={(params: AutocompleteRenderInputParams) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="SubCategorias"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {false && <CircularProgress color="primary" size={20} />}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                    getOptionDisabled={(option: Category) =>
                    (
                      form.values.subCategories &&
                      form.values.subCategories.find((category: Category) => category._id === option._id)
                    )
                      || (option.parentId === '0')
                      ? true : false
                    }
                    getOptionLabel={(op: any) => op.name}
                    onChange={(ev: React.ChangeEvent<{}>, category: Category | null) => {
                      if (category) {
                        push(category)
                      }
                    }}
                    className={classes.autocomplete}
                    onInputChange={(e: React.ChangeEvent<{}>, value: string) => loadCategories({ name: value })}
                  />
                )}
              />
              <Box mt={3}>
                <Grid container>
                  <FieldArray
                    name="subCategories"
                    render={({ form, remove }: FieldArrayRenderProps) => (
                      <Grid container>
                        {form.values.subCategories &&
                          form.values.subCategories.map((category: Category, index: number) => (
                            <Box ml={index !== 0 ? 1 : 0} mt={1} key={index}>
                              <Chip label={category.name} onDelete={() => remove(index)} />
                            </Box>
                          ))}
                      </Grid>
                    )}
                  />
                </Grid>
              </Box>
            </PaperBlock>
            )}
          </div>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(CategoryForm)
