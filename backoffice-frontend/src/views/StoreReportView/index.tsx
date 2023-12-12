import React, { Component } from "react"
import { Box, withStyles } from "@material-ui/core"
import StoresReportPaper from "../../components/Papers/StoresReportPaper"
import styles from './styles'
import { StoreConsumer, StoreProvider } from "../../context/StoreContext"

class StoreReportView extends Component {

  render() {

    return (
      <Box>
        <StoreProvider>
          <StoreConsumer>
            {({ report, getStoreGmvReport }) => (
              <StoresReportPaper report={report!} loadReport={getStoreGmvReport} />
            )}
          </StoreConsumer>
        </StoreProvider>
      </Box>
    )

  }
}

export default withStyles(styles)(StoreReportView)