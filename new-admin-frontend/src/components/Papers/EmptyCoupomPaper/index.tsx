import { Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

import style from './style'

type Props = {
    classes: any
    mode: any
    changeModal: any
}

class EmptyCoupomPaper extends Component<Props> {
    render() {
        const { classes, changeModal } = this.props
        return (
            <div style={{ height: '80%' }}>
                <PaperBlock>
                    <Grid container spacing={5} justify="center" alignItems="center" style={{ height: '100%' }}>
                        <Grid item>
                            <img src={require('../../../assets/images/ilustration/coupom.svg').default} alt="" />
                        </Grid>
                        <Grid item>
                            <Typography className={classes.title}>Fidelize seus clientes</Typography>
                            <Typography className={classes.description}>
                                Ofereça cupons de desconto por quantidade, <br /> porcentagem ou frete grátis e gerencie-os a
                                partir desta tela.
                            </Typography>
                            <Button color="primary" variant="contained" onClick={changeModal}>
                                crie seu primeiro cupom
                            </Button>
                        </Grid>
                    </Grid>
                </PaperBlock>
            </div>
        )
    }
}

export default withStyles(style)(EmptyCoupomPaper)
