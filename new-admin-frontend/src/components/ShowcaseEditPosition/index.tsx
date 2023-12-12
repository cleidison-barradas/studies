import { Grid, Typography, Button } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import React, { Component } from 'react'
import Showcase from '../../interfaces/showcase'
import { ReactComponent as GreenCheck } from '../../assets/images/greenCheck.svg'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import ShowcaseProduct from '../../interfaces/showcaseProduct'
import CancelIcon from '@material-ui/icons/Cancel'
import classNames from 'classnames'
import { BucketS3 } from '../../config'

type Props = {
  classes: any
  showcase: Showcase
  setProducts: any
}

export default class ShowcaseEditPosition extends Component<Props> {
  constructor(props: any) {
    super(props)

    this.state = {}

    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd(result: any) {
    if (!result.destination) return
    console.log('result.destination: '+JSON.stringify(result.destination, null, 4))
    const items = Array.from(this.props.showcase.products)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    items.forEach((product, index) => {
      product.position = index
    })

    this.props.setProducts(items)
  }

  deleteProduct(product: ShowcaseProduct) {
    const products = this.props.showcase.products.filter((value: ShowcaseProduct) => value.product._id !== product.product._id)
    this.props.setProducts(products)
  }

  render() {
    const { classes, showcase } = this.props

    return (
      <>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <Grid container spacing={2} alignItems={'center'} {...provided.droppableProps} ref={provided.innerRef}>
                {showcase.products
                  .sort((first: any, second: any) => {
                    if (first.position < second.position) {
                      return -1
                    } else if (first.position > second.position!) {
                      return 1
                    } else {
                      return 0
                    }
                  })
                  .map((product: ShowcaseProduct, index: any) => {
                    const { _id, name, EAN, quantity, manufacturer, image, specials = [], price } = product.product
                    const specialPrice = specials.length > 0 ? specials[0].price : 0

                    return (
                      <Draggable key={_id} index={index} draggableId={_id!}>
                        {(provider) => (
                          <Grid
                            item
                            lg={12}
                            md={12}
                            sm={6}
                            xs={12}
                            ref={provider.innerRef}
                            {...provider.draggableProps}
                            {...provider.dragHandleProps}
                            key={_id}
                          >
                            <div className={classes.wrapper}>
                              {specials.length > 0 && price && (
                                <div className={classes.badge}>{Math.floor(((specialPrice - price) / price) * 100)}%</div>
                              )}
                              <div className={classes.productpaper}>
                                <Grid container justify="space-between" spacing={1}>
                                  <Grid item lg={6} md={6} xs={6}>
                                    <Typography className={classes.name}>{name}</Typography>
                                    <Typography className={classes.slug}>
                                      {quantity ? `${quantity} UN` : 'Sem quantidade'}
                                    </Typography>
                                    <Typography className={classes.manufacturer}>
                                      {manufacturer ? `Fabricante: ${manufacturer?.name}` : 'Sem fabricante'}
                                    </Typography>
                                    <Typography className={classes.ean}>{EAN ? `EAN: ${EAN}` : 'Sem EAN'}</Typography>
                                  </Grid>
                                  <Grid item lg={6} md={6} xs={6}>
                                    <Grid container justify="flex-end" alignItems="center">
                                      <Grid item>
                                        <img
                                          src={
                                            image
                                              ? `${BucketS3}${image.key}`
                                              : require('../../assets/images/ilustration/nophoto.jpg')
                                          }
                                          alt=""
                                          className={classes.img}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid container justify="space-between" alignItems="center">
                                  <Grid item>
                                    {quantity && quantity > 0 ? (
                                      <Typography className={classes.stockbtn}>
                                        <GreenCheck style={{ marginRight: 4 }} />
                                        Em estoque
                                      </Typography>
                                    ) : (
                                      <Typography className={classNames(classes.stockbtn, classes.nounity)}>
                                        <CancelIcon style={{ marginRight: 4, fontSize: 18 }} />
                                        Sem estoque
                                      </Typography>
                                    )}
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      endIcon={<Delete />}
                                      className={classes.removebtn}
                                      onClick={() => this.deleteProduct(product)}
                                    >
                                      {window.innerWidth < 600 ? 'Remover' : 'Remover da Vitrine'}
                                    </Button>
                                  </Grid>
                                </Grid>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </Draggable>
                    )
                  })}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>
      </>
    )
  }
}
