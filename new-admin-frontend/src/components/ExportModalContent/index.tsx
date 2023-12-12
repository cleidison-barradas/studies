import { FormControlLabel, Radio, RadioGroup, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import style from './style'


type Props = {
    classes: any,
    selectedProducts: any[],
    filteredProducts: any[],
}

class ExportModalContent extends Component<Props> {
    constructor(props: any) {
        super(props)

        this.state = {

        }
    }

    render() {

        const { classes, selectedProducts, filteredProducts } = this.props

        return (
            <>
                <Typography className={classes.caption} >Este arquivo CSV pode atualizar todas as informações do produto.
                Para atualizar apenas as quantidades do estoque, use arquivo <a href="/" className={classes.link} >CSV para estoque.</a></Typography>
                <Typography className={classes.exporttext}>Exportar</Typography>
                <RadioGroup className={classes.radiogroup} >
                    <FormControlLabel value="0" control={<Radio />} label="Página atual" />
                    <FormControlLabel value="1" control={<Radio />} label="Todos os produtos" />
                    <FormControlLabel value="2" control={<Radio />} label={`Selecionado: ${selectedProducts.length} produtos`} />
                    <FormControlLabel value="3" control={<Radio />} label={`${filteredProducts.length} produtos correspondentes á sua pesquisa`} />
                </RadioGroup>
                <Typography className={classes.exporttext}>Exportar como</Typography>
                <RadioGroup className={classes.radiogroup} style={{marginBottom : 28}} >
                    <FormControlLabel value="0" control={<Radio />} label="CSV para Excel, Numbers ou outros programas de planilha" />
                    <FormControlLabel value="1" control={<Radio />} label="Arquivo CSV simples" />
                </RadioGroup>
            </>
        )
    }
}

export default withStyles(style)(ExportModalContent)
