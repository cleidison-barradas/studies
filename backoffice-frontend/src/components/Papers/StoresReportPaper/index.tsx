import React, { Component } from "react"
import { Box, withStyles } from "@material-ui/core"
import styles from './styles'
import PaperBlock from "../../PaperBlock"
import StoresReportTable from "../../Tables/StoresReportTable"
import File from "../../../interfaces/file"

interface Props {
  report: File
  loadReport: (data: any) => Promise<void>
}

class StoresReportPaper extends Component<Props> {
  static defaulProps = {
    report: null
  }

  async componentDidMount() {
    await this.onLoad({})
  }

  onLoad = async (data: any) => {
    const { loadReport } = this.props

    await loadReport(data)
  }

  render() {
    const { report } = this.props
    return (
      <PaperBlock>
        <Box>
          {report && <StoresReportTable reports={[report]} />}
        </Box>

      </PaperBlock>
    )
  }
}


export default withStyles(styles)(StoresReportPaper)