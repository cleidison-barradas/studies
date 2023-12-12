import { Typography } from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'

type Props = {
    classes: any
    mode: any
}

export default class ProductInsight extends Component<Props> {
    render() {
        const { classes, mode } = this.props
        return (
            <div>
                <PaperBlock>
                    <Typography className={classes.title}>Insights Produto</Typography>
                    <section className={classes.section}>
                        <Typography className={classes.text}>
                            Insights são exibidos quando o produto tem vendas recentes e for publicado.
                        </Typography>
                    </section>
                </PaperBlock>
            </div>
        )
    }
}
