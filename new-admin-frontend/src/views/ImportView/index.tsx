import { Box, Button, Grid, Typography, withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router'
import { ReactComponent as GoBack } from '../../assets/images/goBack.svg'
import ImportPaper from '../../components/Papers/ImportPaper'
import { XlsImportConsumer, XlsImportProvider } from '../../context/XlsImporterContext'
import customerxService from '../../services/customerx.service'
import styles from './style'

interface ImportProps {
  id: string
}

interface Props extends RouteComponentProps<ImportProps> {
  mode: any
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class ImportView extends Component<Props> {

  componentDidMount() {
    customerxService.trackingScreen()
  }

  render() {
    const {
      classes,
      mode,
      match: {
        params: { id },
      },
    } = this.props
    return (
      <>
        <XlsImportProvider>
          <XlsImportConsumer>
            {({ fetching, history, requestGetImportHistory }) => (
              <>
                <Box mb={2}>
                  <Grid container alignItems="center" justify="space-between">
                    <Grid item xs={12} lg={6} md={6}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Button
                            className={classes.gobackbtn}
                            classes={{ root: classes.backroot }}
                            onClick={() => this.props.history.goBack()}
                          >
                            <GoBack />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Typography className={classes.gobacktxt}>Identificacao da Importacao ({id}) </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                <ImportPaper
                  {...this.props}
                  id={id}
                  mode={mode}
                  fetching={fetching}
                  historyDetail={history}
                  loadHistory={requestGetImportHistory}
                />
              </>
            )}
          </XlsImportConsumer>
        </XlsImportProvider>
      </>
    )
  }
}

export default withStyles(styles)(ImportView)
