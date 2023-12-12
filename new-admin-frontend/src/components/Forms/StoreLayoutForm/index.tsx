import { Box, withStyles } from '@material-ui/core'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { BucketS3 } from '../../../config'
import toBase64 from '../../../helpers/to-base-64'
import BannersUploader, { BannerRegisterType } from '../../BannersUploader'
import { LayoutHide } from '../../LayoutHide'
import LogoUploader from '../../LogoUploader'
import CustomComponent from '../../CustomComponent'

import styles from './styles'
import Plan from '../../../interfaces/plan'

interface Props {
  plan?: Plan
  store: any,
  history: any
  classes: Record<keyof ReturnType<typeof styles>, string>
  resetColors: () => void
}

class StoreLayoutForm extends CustomComponent<Props> {
  logoToBase64 = async (value: any) => {
    const base64 = await toBase64(value)
    const logo = {
      name: String(value.name).replace(/\s+/g, ''),
      type: value.type,
      url: URL.createObjectURL(value),
      content: base64,
    }
    return logo
  }

  render() {
    const { classes, resetColors, plan, history, store } = this.props
    const configBannerType = {
      institutional: 'text',
      image: 'image',
    } as { [key: Plan['rule']]: BannerRegisterType }

    return (
      <React.Fragment>
        <div className={classes.config}>
          <p className={classes.title}> Configurar</p>
          <div className={classes.section}>
            <p className={classes.subtitle}>Cor principal do site</p>
            <div className={classes.row}>
              <Field type="text" name={'color'} className={classes.textField} />
              <Field type="color" name="color" className={classes.colorInput} />
            </div>

            {this.canSeeComponent(['pro', 'enterprise', 'pro-generic', 'start'], plan) && (
              <>
                <LayoutHide>
                  <Box mb={2} mt={3}>
                    <p className={classes.subtitle}>Cor secundaria do site</p>
                    <div className={classes.row}>
                      <Field type="text" name="secondary" className={classes.textField} />
                      <Field type="color" name="secondary" className={classes.colorInput} />
                    </div>
                  </Box>
                  <Box mt={3}>
                    <p className={classes.subtitle}> Cor de texto das CTA's </p>
                    <div className={classes.row}>
                      <Field type="text" name="text" className={classes.textField} />
                      <Field type="color" name="text" className={classes.colorInput} />
                    </div>
                  </Box>
                  <Box mt={3}>
                    <p className={classes.subtitle}> Cor de texto do cabeçalho </p>
                    <div className={classes.row}>
                      <Field type="text" name="textHeader" className={classes.textField} />
                      <Field type="color" name="textHeader" className={classes.colorInput} />
                    </div>
                  </Box>
                  <Box mt={3}>
                    <p className={classes.subtitle}> Cor de texto do rodapé </p>
                    <div className={classes.row}>
                      <Field type="text" name="textFooter" className={classes.textField} />
                      <Field type="color" name="textFooter" className={classes.colorInput} />
                    </div>
                  </Box>
                </LayoutHide>
                <Box className={classes.customLinkContainer} onClick={resetColors}>
                  <Box className={classes.customLink}>restaurar padrão</Box>
                </Box>
              </>
            )}
          </div>
          <Field name="logo">
            {({ form, field }: FieldProps) => {
              let logo = ''
              if (typeof field.value === 'object') {
                logo = field.value.url
              } else {
                logo = `${BucketS3}${field.value}`
              }
              return (
                <LogoUploader
                  setLogo={async (image: any) => {
                    form.setFieldValue('logo', await this.logoToBase64(image))
                  }}
                  logo={logo}
                  classes={classes}
                />
              )
            }}
          </Field>
          <BannersUploader store={store} history={history} type={configBannerType[plan?.rule || 'image']} />
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(StoreLayoutForm)
