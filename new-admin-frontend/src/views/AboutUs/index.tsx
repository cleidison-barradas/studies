import { withStyles } from '@material-ui/core'
import React, { Component } from 'react'
import HtmlTextEditor from '../../components/HtmlTextEditor'
import PaperBlock from '../../components/PaperBlock'
import { ThemeConsumer } from '../../context/ThemeContext'
import { AboutUsConsumer, AboutUsProvider } from '../../context/AboutUsContext'
import style from './style'
import customerxService from '../../services/customerx.service'
import { FileConsumer, FileProvider } from '../../context/FileContext'

class AboutUs extends Component {
    /**
     * Save AboutUs
     *
     * @param data
     * @param dispatch
     */
    handleSaveAboutUs = (data: any, dispatch: (value: any) => void) => {
        dispatch(data)
    }

    componentDidMount() {
        customerxService.trackingScreen()
    }

    render() {
        return (
            <ThemeConsumer>
                {({ mode, changeMode }) => {
                    return (
                        <AboutUsProvider>
                            <FileProvider>
                                    <FileConsumer>
                                        {({requestAddImage, image}) => (
                                            <AboutUsConsumer>
                                            {({ aboutUs, deletedId, fetching, requestaddAboutUs, requestgetAboutUs }) => (
                                                <PaperBlock title={'Sobre nós'}>
                                                <HtmlTextEditor
                                                    aboutUs={aboutUs}
                                                    deletedId={deletedId}
                                                    fetching={fetching}
                                                    loadAboutUs={requestgetAboutUs}
                                                    addAboutUs={(value: any) => this.handleSaveAboutUs(value, requestaddAboutUs)}
                                                    image={image}
                                                    uploadImage={requestAddImage}
                                                />
                                            </PaperBlock>
                                            )}
                                        </AboutUsConsumer>
                                        )}
                                    </FileConsumer>
                            </FileProvider>
                        </AboutUsProvider>
                    )
                }}
            </ThemeConsumer>
        )
    }
}

export default withStyles(style)(AboutUs)
