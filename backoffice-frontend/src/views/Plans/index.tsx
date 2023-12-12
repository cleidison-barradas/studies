import { Box, Button, Grid, LinearProgress, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import PlanDialog from '../../components/Dialogs/PlanDialog'
import PlansPaper from '../../components/Papers/PlansPaper'
import { PlanConsumer, PlanProvider } from '../../context/PlanContext'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

interface State {
    open: boolean
}

class Plans extends Component<Props, State> {
    state: State = {
        open: false,
    }

    handleModal = () => {
        this.setState({
            ...this.state,
            open: !this.state.open,
        })
    }

    render() {
        const { open } = this.state
        return (
            <PlanProvider>
                <PlanConsumer>
                    {({ plans, getPlans, updatePlan, deletePlan, createPlan, fetching }) => (
                        <React.Fragment>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Button variant="contained" color="primary" onClick={this.handleModal}>
                                        Adicionar
                                    </Button>
                                </Grid>
                            </Grid>
                            <Box mt={2} mb={2} visibility={fetching ? 'visible' : 'hidden'}>
                                <LinearProgress />
                            </Box>
                            <PlansPaper
                                getPlans={getPlans}
                                plans={plans}
                                updatePlan={updatePlan}
                                deletePlan={deletePlan}
                            />
                            <PlanDialog
                                handleClose={this.handleModal}
                                open={open}
                                handleSubmit={async (plan) => {
                                    await createPlan({ plan })
                                    getPlans()
                                }}
                            />
                        </React.Fragment>
                    )}
                </PlanConsumer>
            </PlanProvider>
        )
    }
}

export default withStyles(styles)(Plans)
