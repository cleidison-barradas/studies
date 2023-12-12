import classNames from 'classnames'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

type Props = {
    classes: any
    setLogo: any
    logo: any
}

export default class LogoUploader extends Component<Props> {
    constructor(props: any) {
        super(props)

        this.onChangeLogo = this.onChangeLogo.bind(this)
    }

    onChangeLogo(value: any) {
        if (!value.length) {
          return
        }

        const file = value[0]

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          const img = new Image()
          img.src = reader.result as string
          img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0)
            canvas.toBlob((blob) => {
                if(blob){
              const file = new File([blob], 'image.png', { type: 'image/png' })
              this.props.setLogo(file)
                }
            }, 'image/png', 1)
          }
        }
      }

    render() {
        const { classes, logo } = this.props

        return (
            <div className={classNames(classes.section, window.innerWidth < 500 ? classes.logoCentered : '')}>
                <p className={classes.subtitle}>Logo</p>
                <p className={classes.caption}>(Tamanho máximo indicado de 300 x 300px)</p>
                {logo ? (
                    <Dropzone accept="image/png,image/jpeg" multiple={false} onDrop={(acceptedFiles) => this.onChangeLogo(acceptedFiles)}>
                        {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
                            <div
                                className={classNames(
                                    classes.logoContainer,
                                    isDragAccept ? classes.logoDragAccepted : '',
                                    isDragReject ? classes.logoDragRejected : ''
                                )}
                                style={{
                                    backgroundImage: `url(${logo})`,
                                }}
                                {...getRootProps()}
                            >
                                <input
                                    type="file"
                                    className={classes.fileInput}
                                    id="logo2"
                                    onChange={(e) => this.onChangeLogo(e.target.files)}
                                    {...getInputProps()}
                                />
                            </div>
                        )}
                    </Dropzone>
                ) : (
                    <Dropzone accept="image/png,image/jpeg" multiple={false} onDrop={(acceptedFiles) => this.onChangeLogo(acceptedFiles)}>
                        {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
                            <div
                                className={classNames(
                                    classes.fileContainer,
                                    isDragAccept ? classes.dragAccepted : '',
                                    isDragReject ? classes.dragReject : ''
                                )}
                                {...getRootProps()}
                            >
                                <input
                                    type="file"
                                    className={classes.fileInput}
                                    id="logo"
                                    onChange={(e) => this.onChangeLogo(e.target.files)}
                                    {...getInputProps()}
                                />
                                <img src={require('../../assets/images/blueCloudUploader.svg').default} alt="" />
                                {isDragAccept ? (
                                    <p className={classNames(classes.fileText, classes.dragAccepted)}>Solte as imagens para adiciona-las</p>
                                ) : (
                                    ''
                                )}
                                {!isDragReject && !isDragAccept ? (
                                    <p className={classes.fileText}>Clique aqui e faça Upload do seu Logo</p>
                                ) : (
                                    ''
                                )}
                                {isDragReject ? <p className={classNames(classes.fileText, classes.dragReject)}>Somente imagem</p> : ''}
                            </div>
                        )}
                    </Dropzone>
                )}
            </div>
        )
    }
}
