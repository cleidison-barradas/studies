import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import Plan from '../../../interfaces/plan'
import { PutStorePlanRequest } from '../../../services/api/interfaces/ApiRequest'
import PaperBlock from '../../PaperBlock'
import PlanTable from '../../Tables/PlanTable'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    plans: Plan[]
    getPlans: () => Promise<void>
    updatePlan: (data: PutStorePlanRequest) => Promise<void>
    deletePlan: (id: Plan['_id'] | string) => Promise<void>
}

class PlansPaper extends Component<Props> {
    componentDidMount() {
        const { getPlans } = this.props
        getPlans()
    }
    render() {
        const { plans, updatePlan, deletePlan, getPlans } = this.props
        return (
            <PaperBlock title="Planos">
                <PlanTable plans={plans} getPlans={getPlans} updatePlan={updatePlan} deletePlan={deletePlan} />
            </PaperBlock>
        )
    }
}

export default withStyles(styles)(PlansPaper)
