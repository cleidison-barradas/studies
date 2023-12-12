import { Grid, withStyles } from '@material-ui/core'
import { Field } from 'formik'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import SwitchFormField from '../../SwitchFormField'
import TextFormField from '../../TextFormField'
import styles from './styles'

interface Props {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

class MarketingForm extends Component<Props> {
    render() {
        return (
            <React.Fragment>
                <PaperBlock title="Analytics">
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="gaview" label="GAView" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="ga_client_email" label="Client email" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="ga_private_key" label="Chave privada" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="config_analytics_id" label="Analytics ID" component={TextFormField} />
                        </Grid>
                    </Grid>
                </PaperBlock>
                <PaperBlock title="Login social">
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field name="config_facebook_appId" label="Facebook app ID" component={TextFormField} />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field
                                name="config_facebook_secretKey"
                                label="Chave secreta do Facebook"
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field name="config_google_clientId" label="Client ID google" component={TextFormField} />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field
                                name="config_google_secretkey"
                                label="Chave secreta google"
                                component={TextFormField}
                            />
                        </Grid>
                    </Grid>
                </PaperBlock>
                <PaperBlock title="CustomerX">
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field name="config_cx_id" label="ID" component={TextFormField} />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12} sm={12} xl={6}>
                            <Field name="config_cx_email" label="Email" type="email" component={TextFormField} />
                        </Grid>
                    </Grid>
                </PaperBlock>
                <PaperBlock title="iFood">
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="config_ifood_client_id" label="CLIENT_ID" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="config_ifood_client_secret" label="CLIENT_SECRET" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="config_ifood_store_id" label="idLoja" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field
                                name="config_ifood_charge_percentage"
                                label="Porcentagem da Cobrança"
                                type="number"
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field
                                name="config_ifood_charge_active"
                                label="Ativar cobrança?"
                                component={SwitchFormField}
                            />
                        </Grid>
                    </Grid>
                </PaperBlock>
                <PaperBlock title="Extensões">
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="config_hotjar_id" label="ID Hotjar" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="config_pixel_id" label="Pixel ID" component={TextFormField} />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field name="config_tawk_embed" label="Tawk to" component={TextFormField} />
                        </Grid>
                    </Grid>
                </PaperBlock>
                <PaperBlock title="SEO">
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field
                                name="config_meta_keyword"
                                label="Palavra chave (meta keyword)"
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field
                                name="config_meta_description"
                                label="Meta descrição (meta description)"
                                component={TextFormField}
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={4}>
                            <Field
                                name="config_meta_title"
                                label="Meta titulo (meta title)"
                                component={TextFormField}
                            />
                        </Grid>
                    </Grid>
                </PaperBlock>
                <PaperBlock title="Configurações">
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={3}>
                            <Field
                                name="config_show_celphone"
                                component={SwitchFormField}
                                label="Mostrar celular?"
                                labelPlacement="top"
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={3}>
                            <Field
                                name="config_hide_prices"
                                component={SwitchFormField}
                                label="Esconder preços?"
                                labelPlacement="top"
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={3}>
                            <Field
                                name="config_cpf_checkout"
                                component={SwitchFormField}
                                label="Exigir cpf no checkout?"
                                labelPlacement="top"
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={3}>
                            <Field
                                name="config_withdraw"
                                component={SwitchFormField}
                                label="Permitir retirada?"
                                labelPlacement="top"
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={3}>
                            <Field
                                name="mainStore"
                                component={SwitchFormField}
                                label="Loja Matriz ?"
                                labelPlacement="top"
                            />
                        </Grid>
                        <Grid item lg={4} md={12} xs={12} sm={12} xl={3}>
                            <Field
                                name="config_always_show_popup"
                                component={SwitchFormField}
                                label="Exibir sempre o popup de cep ?"
                                labelPlacement="top"
                            />
                        </Grid>
                    </Grid>
                </PaperBlock>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(MarketingForm)
