import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    LinearProgress,
    TextField,
    Typography,
    withStyles,
} from '@material-ui/core'
import { SearchOutlined } from '@material-ui/icons'
import React, { Component } from 'react'
import Product from '../../../interfaces/product'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    open: boolean
    handleClose: () => void
    handleSubmit: (product: Product) => void
    getProducts: (...args: any) => void
    products: Product[]
    fetching: any
}

interface State {
    EAN: string
    product?: Product
    fetched: boolean
}

class ProductSearchDialog extends Component<Props, State> {
    state: State = {
        EAN: '',
        fetched: false,
    }

    handleState = (field: any, value: any) => {
        this.setState({
            ...this.state,
            [field]: value,
        })
    }

    searchByEAN = async () => {
        const { EAN } = this.state
        const { getProducts } = this.props
        getProducts({query:EAN, onAdmin: true})
        this.setState({
            ...this.state,
            fetched: true,
        })
    }

    componentDidMount() {
        const { getProducts } = this.props
        getProducts({onAdmin: true})
    }

    render() {
        const { EAN, product, fetched } = this.state
        const { open, handleClose, handleSubmit, classes, products, fetching } = this.props
        return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Procurar produto</DialogTitle>
                <DialogContent>
                    <Typography
                        variant="body2"
                        gutterBottom
                        classes={{
                            root: classes.description,
                        }}
                    >
                        Procure o produto pelo EAN (código de barras). Se houver registro dele em nossa base, completamos todos os campos de forma automática!
                    </Typography>
                    <Box mt={3} mb={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="EAN"
                            classes={{
                                root: classes.textfield,
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton disabled={EAN.length === 0} onClick={this.searchByEAN}>
                                        <SearchOutlined color={EAN.length === 0 ? 'disabled' : 'primary'} />
                                    </IconButton>
                                ),
                            }}
                            value={EAN}
                            onChange={(e) => this.handleState('EAN', e.target.value)}
                        />
                    </Box>
                    {fetching && <LinearProgress />}
                    {fetched && !fetching && <Typography align="center"> {products.length} Produtos encontrados </Typography>}
                    <Box mb={3} mt={3}>
                        <Grid className={classes.wrapperProducts} container spacing={3} justify="center" alignItems="center">
                            {products.map((value: Product, index: number) => (
                                <Grid item lg={4} xl={3} md={6} sm={12} key={index}>
                                    <Button
                                        onClick={() => this.handleState('product', value)}
                                        color={product && product._id === value._id ? 'primary' : 'default'}
                                    >
                                        {value.name}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Grid container justify="space-between">
                        <Grid item>
                            <Button onClick={handleClose}>Pular</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" disabled={!product} onClick={() => handleSubmit(product!)}>
                                Próximo
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(ProductSearchDialog)
