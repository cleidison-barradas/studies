import React, { Component } from 'react'
import ImportHistoryPaper from '../../components/Papers/ImportHistoryPaper'
import { ImportConsumer, ImportProvider } from '../../context/ImportContext'

class ImportHistory extends Component {
    render() {
        return (
            <ImportProvider>
                <ImportConsumer>
                    {({ requestImportPmc, fetching, success }) => (
                        <ImportHistoryPaper fetching={fetching} success={success} onSend={requestImportPmc} />
                    )}
                </ImportConsumer>
            </ImportProvider>
        )
    }
}

export default ImportHistory
