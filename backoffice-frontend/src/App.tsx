import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppContainer from './containers/App'
import './helpers/yup-translate.helper'

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <AppContainer />
            </BrowserRouter>
        )
    }
}
