import { Box, Button, Grid } from '@material-ui/core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BillboardsPaper from '../../components/Papers/BillboardsPaper'
import { BillboardConsumer, BillboardProvider } from '../../context/BillboardContext'


class Billboards extends Component {
    render() {
        return (
            <BillboardProvider>
                <BillboardConsumer>
                    {({ getBillboard }) => (
                        <React.Fragment>
                            <Grid component={Box} mb={2} container justify="flex-end">
                                <Button component={Link} to="/billboard/new" variant="contained" color="primary">
                                    novo aviso
                                </Button>
                            </Grid>
                            <BillboardsPaper getBillboard={getBillboard} />
                        </React.Fragment>
                    )}
                </BillboardConsumer>
            </BillboardProvider>
        )
    }
}

export default Billboards
