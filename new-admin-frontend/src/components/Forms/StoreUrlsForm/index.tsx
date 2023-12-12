import { Grid, Typography, withStyles, Button, Tooltip } from '@material-ui/core'
import React, { Component } from 'react'
import { AddOutlined, Delete, Help } from '@material-ui/icons'
import TextFormField from '../../TextFormField'
import { Field, FieldArray, FieldArrayRenderProps } from 'formik'
import styles from './styles'
import StoreUrls from '../../../interfaces/storeUrls'

interface Props {
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class StoreUrlForm extends Component<Props> {
  static defaultProps = {}
  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8} sm={8}>
            <div className={classes.divtexthelp}>
              <Typography className={classes.title}>Adicione urls de suas Filiais</Typography>
              <Tooltip title="Opção para habilitar redirecionamento por popup, adicione as filiais de sua farmácia obs: (Inclua somente as urls do seu subdomíno, outras urls não serão salvas!).">
                <Help className={classes.iconhelp} />
              </Tooltip>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3} alignItems="center">
          <FieldArray
            name="storeUrls"
            render={({ form, push, remove }: FieldArrayRenderProps) =>
              form.values.storeUrls && form.values.storeUrls.length > 0 ? (
                form.values.storeUrls.map((storeurls: StoreUrls, index: number) => (
                  <div className={classes.divcontainer} key={index}>
                    <Grid container spacing={3} key={index}>
                      <Grid item xs={12} sm={4} md={4}>
                        <Field
                          name={`storeUrls.${index}.url_name`}
                          autoComplete="off"
                          label="Nome da Filial"
                          component={TextFormField}
                          className={classes.inputs}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={4}>
                        <Field
                          name={`storeUrls.${index}.url_address`}
                          autoComplete="off"
                          label="Url da Filial"
                          component={TextFormField}
                          className={classes.inputs}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={4}>
                        <Tooltip title="Para que as alteracões sejam salvas clique em SALVAR !">
                          <Button onClick={() => push({ name: '', url: '' })}>
                            <div>
                              <AddOutlined fontSize="small" color="inherit" />
                            </div>
                            Adicionar
                          </Button>
                        </Tooltip>
                        <Tooltip title="Para que as alteracões sejam salvas clique em SALVAR !">
                          <Button onClick={() => remove(index)}>
                            <div>
                              <Delete fontSize="small" color="inherit" />
                            </div>
                            Remover
                          </Button>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </div>
                ))
              ) : (
                <div className={classes.divcontainer}>
                  <div>
                    <Button
                      className={classes.actionbutton}
                      variant="outlined"
                      color="secondary"
                      onClick={() => push({ url_name: '', url_address: '' })}
                    >
                      Criar nova url
                    </Button>
                  </div>
                </div>
              )
            }
          />
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(StoreUrlForm)
