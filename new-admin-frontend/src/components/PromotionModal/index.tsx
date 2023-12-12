
import DateFnsUtils from '@date-io/date-fns'
import { Divider, FormControl, Input, InputAdornment, MenuItem, Select, Typography, withStyles } from '@material-ui/core'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { endOfDay, startOfDay } from 'date-fns'
import React, { Component } from 'react'
import style from './style'

type Props = {
    classes: any
    selected?: any
    promotion: any
    setPromotion: (value: any) => void
}

class PromotionModalContent extends Component<Props> {
    constructor(props: any) {
        super(props)
        this.onChangeInitialDate = this.onChangeInitialDate.bind(this)
        this.onChangeFinalDate = this.onChangeFinalDate.bind(this)
        this.onChangePrice = this.onChangePrice.bind(this)

        this.onChangeDiscountPercentage = this.onChangeDiscountPercentage.bind(this)
    }

    onChangeInitialDate(date_start: any) {
        const { setPromotion, promotion } = this.props

        setPromotion({
            ...promotion,
            date_start: startOfDay(new Date(date_start)),
        })
    }

    onChangeFinalDate(date_end: any) {
        const { setPromotion, promotion } = this.props
        setPromotion({
            ...promotion,
            date_end: endOfDay(new Date(date_end)),
        })
    }

    onChangePrice(price: number) {
        const { setPromotion, promotion } = this.props
        setPromotion({
            ...promotion,
            price,
        })
    }
    onChangeTypeDiscount(typeDiscount: any) {
        const { setPromotion, promotion } = this.props
        setPromotion({
            ...promotion,
            typeDiscount: typeDiscount === 'pricePromotion' ?
                'pricePromotion' : 'discountPromotion',
        })
    }

    onChangeDiscountPercentage(discountPercentage: number) {
        const { setPromotion, promotion } = this.props
        setPromotion({
            ...promotion,
            discountPercentage,
        })
    }

    handlePublish(status: any) {
        const { setPromotion, promotion } = this.props
        setPromotion({
            ...promotion,
            status: status === 'true' ? true : false,
        })
    }

    render() {
        const { classes, selected, promotion } = this.props
        return (
            <>
                <div className={classes.inputgroup} style={{ marginTop: 16, marginBottom: 16 }}>
                    <Typography className={classes.label}>Tipo do desconto</Typography>
                    <FormControl
                        classes={{
                            root: classes.select,
                        }}
                    >
                        <Select style={{ width: 180 }}
                            value={promotion.typeDiscount}
                            onChange={(e) => this.onChangeTypeDiscount(e.target.value)}>
                            <MenuItem value="pricePromotion">Valor promocional</MenuItem>
                            <MenuItem value="discountPromotion">Desconto percentual</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {promotion.typeDiscount === 'pricePromotion' ? (
                    <>
                        <Divider className={classes.divisor} />
                        <div className={classes.comparerow}>
                            <div className={classes.inputgroup}>
                                <Typography className={classes.label}>Preço da Promoção</Typography>
                                <FormControl
                                    classes={{
                                        root: classes.formcontrolroot,
                                    }}
                                >
                                    <Input
                                        type="number"
                                        onChange={(e) => this.onChangePrice(Number(e.target.value))}
                                        startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <Typography className={classes.caption} style={{ marginTop: 8 }}>
                            Todos os {selected.length} produtos terão seu valor promocional alterados{' '}
                        </Typography>
                        <Divider />
                    </>
                ) : null}
                {promotion.typeDiscount === 'discountPromotion' ? (
                    <>
                        <Divider className={classes.divisor} />
                        <div className={classes.comparerow}>
                            <div className={classes.inputgroup}>
                                <Typography className={classes.label}>Percentual de desconto</Typography>
                                <FormControl
                                    classes={{
                                        root: classes.formcontrolroot,
                                    }}
                                >
                                    <Input
                                        type="number"
                                        onChange={(e) => this.onChangeDiscountPercentage(Number(e.target.value))}
                                        startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <Typography className={classes.caption} style={{ marginTop: 8 }}>
                            Todos os {selected.length} produtos terão seu valor promocional alterados{' '}
                        </Typography>
                        <Divider />
                    </>
                ) : null}
                <div className={classes.row}>
                    <Typography className={classes.label}>Inicia em</Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="dialog"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            value={promotion.date_start}
                            onChange={this.onChangeInitialDate}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div className={classes.row}>
                    <Typography className={classes.label}>Finaliza em</Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="dialog"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            value={promotion.date_end}
                            onChange={this.onChangeFinalDate}
                            fullWidth={window.innerWidth < 700}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <Divider />
            </>
        )
    }
}

export default withStyles(style)(PromotionModalContent)