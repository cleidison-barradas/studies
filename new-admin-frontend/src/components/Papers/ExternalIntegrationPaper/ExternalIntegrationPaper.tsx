import React from 'react'
import { withStyles } from '@material-ui/styles'
import styles from './styles'
import PaperBlock from '../../PaperBlock'
import CustomComponent from '../../CustomComponent'
import ExternalIntegrationForm from '../../Forms/ExternalIntegrationForm'
import Order from '../../../interfaces/order'
import { SubmitFiscalDocumentForm, SubmitOrderDispatch } from '../../../interfaces/fiscalDocument'

type IFormType = 'invoice' | 'shipping'

interface Props {
    order: Order
    type: IFormType[]
    isPluggto?: boolean
    onSetOrderDispatch: ({ orderDispatch }: SubmitOrderDispatch) => void
    onSetFiscalDocument: ({ fiscalDocument }: SubmitFiscalDocumentForm) => void
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class ExternalIntegrationPaper extends CustomComponent<Props> {

    render() {
        const { type, order, isPluggto, onSetFiscalDocument, onSetOrderDispatch } = this.props

        return (
            <div>
                <PaperBlock title={'Informações obrigatórias de integração.'}>
                    {type.map(_type => (
                        <ExternalIntegrationForm
                            key={_type}
                            type={_type}
                            order={order}
                            isPluggto={isPluggto}
                            onSetOrderDispatch={onSetOrderDispatch}
                            onSetFiscalDocument={onSetFiscalDocument}
                        />
                    ))}
                </PaperBlock>
            </div>
        )
    }
}

export default withStyles(styles)(ExternalIntegrationPaper)
