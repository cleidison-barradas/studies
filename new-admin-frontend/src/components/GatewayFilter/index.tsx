import { FormControl, MenuItem, Select, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import styles from './styles'

interface Props {
    value: string,
    color?: 'light' | 'dark'
}

class GatewayFilter extends Component<Props> {
    render(){
        const { value, color = 'light' } = this.props

        return(
            <FormControl fullWidth>
                <Select value={value}>
                    <MenuItem value="none">Selecione um método de crédito online</MenuItem>
                    <MenuItem value="stone">MyPharma Pay</MenuItem>
                    <MenuItem value="pagseguro">PagSeguro</MenuItem>
                </Select>
            </FormControl>
        )
    }
}

export default withStyles(styles)(GatewayFilter)