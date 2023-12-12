import { Component } from 'react'
import { Field } from 'formik'
import { Box } from '@material-ui/core'

import Plan from '../../../interfaces/plan'

import TextFormField from '../../TextFormField'
import SwitchFormField from '../../SwitchFormField'
import Banner from '../../../interfaces/banner'

interface Props {
  plan?: Plan
  placeholders: Banner['placeholders']
  store: any
  history: any
  classes: any
}

export default class TextBannerForm extends Component<Props> {
  render() {
    const { classes, placeholders } = this.props

    return (
      <Box display="flex" flexDirection="column">
        <p className={classes?.title}> Configurar</p>

        <Box marginTop="24px" marginBottom="54px">
          <Field
            type="text"
            name="title"
            label="Título"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ maxLength: 60 }}
            className={classes.input}
            placeholder={placeholders?.title || '50% de desconto'}
            component={TextFormField}
          />
        </Box>

        <Box>
          <Field
            type="text"
            name="description"
            label="Descrição"
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            maxRows={4}
            rows={4}
            inputProps={{ maxLength: 130 }}
            className={classes.input}
            placeholder={placeholders?.description || 'em produtos selecionados de toda linha de medicamentos'}
            component={TextFormField}
          />
        </Box>

        <Box className={classes.actions}>
          <Box className={classes.cardAction}>
            <Field
              name="whatsappAction"
              labelPlacement="start"
              label="Botão WhatsApp"
              className={classes.input}
              component={SwitchFormField}
            />
          </Box>

          <Box className={classes.cardAction}>
            <Field
              name="landlineAction"
              labelPlacement="start"
              label="Botão Telefone Fixo"
              className={classes.input}
              component={SwitchFormField}
            />
          </Box>
          <Box className={classes.cardAction}>
            <Field
              name="locationAction"
              labelPlacement="start"
              label="Botão Localização"
              className={classes.input}
              component={SwitchFormField}
            />
          </Box>
        </Box>
      </Box>
    )
  }
}
