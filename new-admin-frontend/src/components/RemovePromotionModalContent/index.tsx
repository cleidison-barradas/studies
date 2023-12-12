import { Checkbox, InputAdornment, Switch, TextField, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import ProductPromotion from '../../interfaces/productPromotion'
import style from './style'
import { ReactComponent as GreySearchIcon } from '../../assets/images/greySearchIcon.svg'
import classNames from 'classnames'
type Props = {
    classes: any,
}

type State = {
    selected: any[],
    promotions: ProductPromotion[],
    filtered: ProductPromotion[]
}

class RemovePromotionModalContent extends Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            selected: [],
            filtered: [],
            promotions: []
        }
        this.filter = this.filter.bind(this)
        this.loadPromotions = this.loadPromotions.bind(this)
        this.select = this.select.bind(this)
        this.selectAll = this.selectAll.bind(this)
    }

    componentDidMount() {
        this.loadPromotions()
    }

    filter(text: string) {
        const { promotions } = this.state
        const filtered: ProductPromotion[] = promotions.filter((value: ProductPromotion) => value.title.trim().toLowerCase().includes(text.trim().toLowerCase()))
        this.setState({
            ...this.state,
            filtered
        })
    }

    loadPromotions() {
        const promotions: ProductPromotion[] =
            [
                {
                    _id: '123',
                    price: 8.90,
                    initialDate: new Date(),
                    finalDate: new Date(),
                    products: [],
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    published: true,
                    title: 'Dois por um',
                    typeDiscount: 'pricePromotion',
                    typePromotion: 'product',
                    classification: [],
                    category: [],
                    discountPercentage: 10
                },
                {
                    _id: '1234',
                    price: 8.90,
                    initialDate: new Date(),
                    finalDate: new Date(),
                    products: [],
                    updatedAt: new Date(),
                    createdAt: new Date(),
                    published: true,
                    title: 'Promo desodorante',
                    typeDiscount: 'pricePromotion',
                    typePromotion: 'product',
                    classification: [],
                    category: [],
                    discountPercentage: 10
                },
            ]
        this.setState({
            ...this.state,
            promotions,
            filtered: promotions
        })
    }

    select(promotion: ProductPromotion) {
        const { selected } = this.state
        if (selected.includes(promotion._id)) {
            const index = selected.findIndex((value: any) => value === promotion._id)
            const cut = selected.splice(0, index)
            this.setState({
                ...this.state,
                selected : cut
            })
        } else {
            selected.push(promotion._id)
            this.setState({
                ...this.state,
                selected
            })
        }
    }

    selectAll() {
        if (this.state.selected.length === this.state.promotions.length) {
            this.setState({
                ...this.state,
                selected: []
            })
        } else {
            const ids = this.state.promotions.map((value: ProductPromotion) => value._id)
            this.setState({
                ...this.state,
                selected: [...ids]
            })
        }
    }

    render() {
        const { classes } = this.props
        const { filtered, selected } = this.state
        return (
            <>
                <div className={classes.row}>
                    <Checkbox
                        checked={filtered.length > 0 && filtered.length === selected.length}
                        onChange={this.selectAll}
                    />
                    <Typography className={classes.title} >Titulo</Typography>
                    <TextField
                        label={'Procurar promoções'}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        onChange={(e) => this.filter(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" >
                                    <GreySearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                {
                    filtered.map((promotion: ProductPromotion) => (
                        <div className={classes.promotionrow} key={promotion._id} >
                            <div className={classes.row} >
                                <Checkbox
                                    checked={selected.includes(promotion._id)}
                                    onChange={() => this.select(promotion)}
                                />
                                <Typography className={classes.rowtitle} > {promotion.title} </Typography>
                            </div>
                            <div className={classNames(classes.statuscontainer, classes[`status${promotion.published.toString()}`])} >
                                <Typography className={classes.publishedtext} >{promotion.published ? 'Publicado' : 'Não Publicado'}</Typography>
                                <Switch color="default" checked={promotion.published} disabled />
                            </div>
                        </div>
                    ))
                }
            </>
        )
    }
}

export default withStyles(style)(RemovePromotionModalContent)
