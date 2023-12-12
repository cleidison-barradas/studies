import React, { Component } from 'react'
import BillboardPaper from '../../components/Papers/BillboardPaper'
import {  BillboardProvider } from '../../context/BillboardContext'


class NewBillboard extends Component{
    render() {
        return (
            <BillboardProvider>
                <BillboardPaper />
            </BillboardProvider>
        )
    }
}

export default NewBillboard
