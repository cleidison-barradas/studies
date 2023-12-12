import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
  withStyles,
  CircularProgress,
} from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'
import ArrowDown from '../../assets/images/blackArrowDown.svg'
import ArrowUp from '../../assets/images/blackArrowUp.svg'
import classNames from 'classnames'
import CustomDialog from '../CustomDialog'
import CategoryModalContent from '../CategoryModalContent'
import { ReactComponent as BlackGoTo } from '../../assets/images/blackGoTo.svg'
import PromotionModal from '../PromotionModal'
import Product from '../../interfaces/product'
import { Link, RouteComponentProps } from 'react-router-dom'
import { CategoryConsumer, CategoryProvider } from '../../context/CategoryContext'
import { IDialogContentType } from '../../interfaces/dialog'

type ModalOptions = 'published' | 'not_published' | 'delete' | 'showcase' | 'addPromotion' | 'removePromotion' | 'addCategory' | 'removeCategory'

interface IModal {
  open: boolean
  title: string
  dividers?: boolean
  footer: string | IDialogContentType
  content: string | IDialogContentType
}

type State = {
  modal: IModal
  anchorEl: any
  promotion: any
  category: string[]
  openPopper: boolean
}

interface Props extends RouteComponentProps {
  classes: any
  open: boolean
  fetching: boolean
  selected: string[]
  getProducts: () => Promise<void>
  setOpen: (value: boolean) => void
  onDelete: (id: string[]) => Promise<void>
  addPromotions: (data: any) => Promise<void>
  onUpdateStatus: (status: boolean) => Promise<void>
  addProducts: (products: Product['_id'][]) => Promise<void>
  updateProductCategory: (category: string[]) => Promise<void>
}

class SeeMoreDropDown extends Component<Props, State> {
  private anchorRef: React.RefObject<HTMLElement>

  constructor(props: Props) {
    super(props)

    this.state = {
      anchorEl: null,
      openPopper: false,
      modal: {
        title: '',
        content: '',
        open: false,
        footer: '',
        dividers: true,
      },
      category: [],
      promotion: {
        date_start: new Date(),
        date_end: new Date(),
        price: 0,
        discountPercentage: 0,
        typePromotion: 'product',
        typeDiscount: 'pricePromotion'
      },
    }
    this.anchorRef = React.createRef<HTMLElement>()
    this.handleClose = this.handleClose.bind(this)
  }

  handleUpdateCategoryProduct = async () => {
    const { category } = this.state
    const { updateProductCategory } = this.props
    await updateProductCategory(category)
  }

  handleClose = () => {
    const { modal } = this.state

    if (!modal.open) {
      this.props.setOpen(false)
    }
  }

  handleSetCategory = (categoryId: string) => {
    const { category } = this.state

    const index = category.findIndex(id => id === categoryId)

    if (index !== -1) {
      category.splice(index, 1)
    } else {
      category.push(categoryId)
    }
  }

  setPromotion = (promotion: any) => {
    this.setState({
      ...this.state,
      promotion,
    })
  }

  openModal = async (option: ModalOptions) => {
    const { category, modal } = this.state
    const { classes, selected, history, onUpdateStatus, onDelete, addProducts, addPromotions, updateProductCategory } = this.props

    let save: () => void
    let close: () => void

    switch (option) {
      case 'published':
        save = async () => {
          await onUpdateStatus(true)
          this.closeModal()
        }

        close = () => {
          this.closeModal()
        }

        modal.footer = () => (
          <React.Fragment>
            <Button
              onClick={close}
              variant="outlined"
              classes={{
                label: classes.cancelbtnlabel,
              }}
            >
              cancelar
            </Button>
            <Button
              onClick={save}
              color="primary"
              variant="contained"
            >
              definir como Publicado
            </Button>
          </React.Fragment>
        )

        modal.content = 'Os produtos definidos como Publicados ficam disponíveis nos canais de vendas e apps selecionados.'

        modal.title = `Definir ${selected.length} produto(s) como Publicado(s) ?`

        break

      case 'not_published':
        save = async () => {
          await onUpdateStatus(false)
          this.closeModal()
        }

        close = () => {
          this.closeModal()
        }

        modal.footer = () => (
          <React.Fragment>
            <Button
              onClick={close}
              variant="outlined"
              classes={{
                label: classes.cancelbtnlabel,
              }}
              disabled={this.props.fetching}
            >
              cancelar
            </Button>

            <Button
              disabled={this.props.fetching}
              onClick={save}
              variant="contained"
              color="primary"
              classes={{
                contained: classes.unpublish,
              }}
            >
              {!this.props.fetching ? 'definir como Não Publicado' : <CircularProgress size={25} />}
            </Button>
          </React.Fragment>
        )

        modal.content = 'Os produtos definidos como Não Publicado ficam ocultos em todos os canais de vendas e apps.'
        modal.title = `Definir ${selected.length} produto(s) como Não Publicado ?`

        break

      case 'delete':
        save = async () => {
          await onDelete(selected)
          this.closeModal()
        }

        close = () => {
          this.closeModal()
        }

        modal.footer = () => (
          <React.Fragment>
            <Button
              onClick={close}
              variant="outlined"
              classes={{
                label: classes.cancelbtnlabel,
              }}
            >
              cancelar
            </Button>

            <Button
              onClick={save}
              variant="contained"
              classes={{
                contained: classes.delete,
              }}
            >
              Excluir
            </Button>
          </React.Fragment>
        )

        modal.content =
          'A exclusão oculta os produtos do admin da da sua loja e dos canais de vendas.'
        modal.title = `Remover ${selected.length} produto(s) ?`

        break
      case 'showcase':
        save = async () => {
          await addProducts(selected)
          history.push('/showcase')
          this.closeModal()
        }

        close = () => {
          this.closeModal()
        }

        modal.footer = () => (
          <React.Fragment>
            <Button
              onClick={close}
              variant="outlined"
              classes={{
                label: classes.cancelbtnlabel,
              }}
            >
              cancelar
            </Button>

            <Button
              onClick={save}
              variant="contained"
              classes={{
                contained: classes.showcase,
              }}
            >
              adicionar a vitrine
            </Button>
          </React.Fragment>
        )

        modal.content =
          'Ao adicionar produtos na vitrine eles são adicionados automaticamente na página inicial do seu site por ordem de data de modificação.'
        modal.title = `Adicionar ${selected.length} produto(s) na Vitrine?`

        break

      case 'addCategory':
        save = async () => {
          await updateProductCategory(category)
          this.closeModal()
        }

        close = () => {
          this.closeModal()
        }

        modal.content = () => (
          <CategoryProvider>
            <CategoryConsumer>
              {({ getCategorys, categorys: categories }) => (
                <CategoryModalContent
                  selected={selected}
                  categories={categories}
                  loadCategories={getCategorys}
                  setCategory={this.handleSetCategory}
                />
              )}

            </CategoryConsumer>
          </CategoryProvider>
        )

        modal.footer = () => {
          return (
            <div className={classes.footer}>
              <Button variant="text">
                <BlackGoTo style={{ marginRight: 8 }} />
                Gerenciar Categorias
              </Button>
              <div>
                <Button
                  onClick={close}
                  variant="outlined"
                  classes={{
                    label: classes.cancelbtnlabel,
                  }}
                >
                  cancelar
                </Button>
                <Button variant="contained" color="primary" className={classes.savebtn} onClick={save}>
                  Salvar
                </Button>
              </div>
            </div>
          )
        }

        modal.dividers = false

        modal.title = `Adicionar ${selected.length} produtos á(s) categoria(s)`

        break
      case 'removeCategory':
        save = async () => {
          await updateProductCategory([])
          this.closeModal()
        }

        close = () => {
          this.closeModal()
        }
        modal.content = 'Remove as categorias cadastrados no produto.'

        modal.footer = () => {
          return (
            <div className={classes.footer}>
              <Button variant="outlined" onClick={() => history.push('/categories')}>
                Gerenciar Categorias
              </Button>
              <div>
                <Button
                  onClick={close}
                  variant="outlined"
                  classes={{
                    label: classes.cancelbtnlabel,
                  }}
                >
                  cancelar
                </Button>
                <Button variant="contained" color="primary" className={classes.delete} onClick={save} style={{ marginLeft: 8 }}>
                  Remover
                </Button>
              </div>
            </div>
          )
        }

        modal.dividers = false

        modal.title = `Remover ${selected.length} produtos á(s) categoria(s)`
        break

      case 'addPromotion':
        save = async () => {
          const { promotion } = this.state
          const filteredData: any = {
            typePromotion: promotion.typePromotion,
            typeDiscount: promotion.typeDiscount,
            date_start: promotion.date_start,
            date_end: promotion.date_end,
            products: this.props.selected,
            price: promotion.price,
            discountPercentage: promotion.discountPercentage,
          }

          try {
            await addPromotions(filteredData)
            this.closeModal()
          } catch (error: any) {
            console.error(error)
          }
        }

        close = () => {
          this.closeModal()
        }

        modal.content = () => (
          <PromotionModal selected={selected} promotion={this.state.promotion} setPromotion={this.setPromotion} />
        )

        modal.footer = () => {
          return (
            <div className={classes.footer}>
              <Link to="/marketing/promotions" className={classes.cancelbtnlabel}>
                <BlackGoTo style={{ marginRight: 8 }} />
                Gerenciar Promoções
              </Link>
              <div>
                <Button
                  onClick={close}
                  variant="outlined"
                  classes={{
                    label: classes.cancelbtnlabel,
                  }}
                >
                  cancelar
                </Button>
                <Button variant="contained" color="primary" className={classes.save} onClick={save} style={{ marginLeft: 8 }}>
                  Salvar
                </Button>
              </div>
            </div>
          )
        }

        modal.dividers = false

        modal.title = `Criar promoção com  ${selected.length} produto(s)`
        break

      default:
        break
    }

    modal.open = true
    this.setState(state => ({
      ...state,
      modal
    }))
  }

  closeModal = () => {
    this.setState(state => ({
      ...state,
      modal: {
        ...state.modal,
        open: false,
      },
    }))
  }

  render() {
    const { classes, open, setOpen } = this.props
    const { modal } = this.state

    return (
      <React.Fragment>
        <Typography
          ref={this.anchorRef as React.RefObject<HTMLParagraphElement>}
          className={classes.buttontext}
          onClick={() => setOpen(!open)}
        >
          Mais Opções <img src={open ? ArrowUp : ArrowDown} alt="" />
        </Typography>
        <Popper open={open} anchorEl={this.anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                <Paper>
                  <MenuList className={classes.list}>
                    <MenuItem onClick={() => this.openModal('published')} className={classes.menuitem}>
                      Definir como Publicado
                    </MenuItem>
                    <MenuItem onClick={() => this.openModal('not_published')} className={classes.menuitem}>
                      Definir como não Publicado
                    </MenuItem>
                    <div className={classes.borderBottom}>
                      <MenuItem onClick={() => this.openModal('delete')} className={classes.menuitem}>
                        Excluir Produtos
                      </MenuItem>
                    </div>
                    <div className={classes.borderBottom}>
                      <MenuItem onClick={() => this.openModal('showcase')} className={classNames(classes.menuitem)}>
                        Adicionar na Vitrine
                      </MenuItem>
                    </div>
                    <MenuItem onClick={() => this.openModal('addCategory')} className={classes.menuitem}>
                      Adicionar as Categorias
                    </MenuItem>
                    <MenuItem onClick={() => this.openModal('removeCategory')} className={classes.menuitem}>
                      Remover Categorias
                    </MenuItem>
                    <MenuItem onClick={() => this.openModal('addPromotion')} className={classes.menuitem}>
                      Criar Promoções
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          )}
        </Popper>
        <CustomDialog
          open={modal.open}
          title={modal.title}
          footer={modal.footer}
          content={modal.content}
          dividers={modal.dividers}
          paperWidthSm={classes.paperWidthSm}
          closeModal={this.closeModal}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(style)(SeeMoreDropDown)