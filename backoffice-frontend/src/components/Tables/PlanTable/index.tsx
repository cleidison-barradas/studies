import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    withStyles,
} from '@material-ui/core'
import { DeleteOutlined, EditOutlined } from '@material-ui/icons'
import React, { Component } from 'react'
import Plan from '../../../interfaces/plan'
import { PutStorePlanRequest } from '../../../services/api/interfaces/ApiRequest'
import PlanDialog from '../../Dialogs/PlanDialog'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
    plans: Plan[]
    updatePlan: (data: PutStorePlanRequest) => Promise<void>
    deletePlan: (id: Plan['_id'] | string) => Promise<void>
    getPlans: () => Promise<void>
}

interface State {
    open: boolean
    plan: Plan
}

class PlanTable extends Component<Props, State> {
    state: State = {
        open: false,
        plan: {
            name: '',
            description: '',
            price: 0,
        },
    }

    handleModal = (plan?: Plan) => {
        this.setState({
            ...this.state,
            open: !this.state.open,
            plan: {
                ...this.state.plan,
                ...plan,
            },
        })
    }

    handleDelete = async (id: Plan['_id'] | string) => {
        const { deletePlan, getPlans } = this.props
        await deletePlan(id)
        getPlans()
    }

    handleUpdate = async (values: Plan) => {
        const { updatePlan, getPlans } = this.props
        await updatePlan({ plan: values })
        getPlans()
    }

    render() {
        const { open, plan } = this.state
        const { plans } = this.props
        return (
            <React.Fragment>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Preço</TableCell>
                                <TableCell>Editar</TableCell>
                                <TableCell>Excluir</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.map((value: Plan) => (
                                <TableRow key={value._id}>
                                    <TableCell>{value.name}</TableCell>
                                    <TableCell>{value.description}</TableCell>
                                    <TableCell>R$ {value.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => this.handleModal(value)}>
                                            <EditOutlined />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => this.handleDelete(value._id)}>
                                            <DeleteOutlined />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <PlanDialog
                    handleClose={this.handleModal}
                    open={open}
                    handleSubmit={(values) => this.handleUpdate(values)}
                    plan={plan}
                />
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(PlanTable)
