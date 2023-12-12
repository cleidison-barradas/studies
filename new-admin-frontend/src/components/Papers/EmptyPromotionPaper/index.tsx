import { Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import style from './style'

type Props = {
    mode: any
    history: any
    classes: any
}

class EmptyPromotionPaper extends Component<Props> {
    render() {
        const { classes, history } = this.props
        return (
            <div>
                <PaperBlock>
                    <Grid container spacing={5} justify="center" alignItems="center" style={{ height: '100%' }}>
                        <Grid item>
                            <img src={require('../../../assets/images/ilustration/promotion.svg').default} alt="" />
                        </Grid>
                        <Grid item>
                            <Typography className={classes.title}>Aumente suas vendas com promoções</Typography>
                            <Typography className={classes.description}>
                                Ofereça 2x1, 3x2 e descontos de quantidade a seus clientes. Aplique nos produtos e categorias que
                                você deseja.
                            </Typography>
                            <Button color="primary" variant="contained" onClick={() => history.push('/marketing/promotions/add')}>
                                crie sua primeira promoção
                            </Button>
                        </Grid>
                    </Grid>
                </PaperBlock>
            </div>
        )
    }
}

export default withStyles(style)(EmptyPromotionPaper)
