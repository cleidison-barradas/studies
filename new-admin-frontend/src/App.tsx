import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppContainer from './containers/App'
import './helpers/yupLocale.ts'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <AppContainer />
            </BrowserRouter>
        )
    }
}
