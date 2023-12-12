import {  withStyles } from '@material-ui/core'
import classNames from 'classnames'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import style from './style'


type Props = {
    classes: any,
    onChange: (file: any) => void,
    maxFiles?: number,
    filesLength?: number,
    accept?: string,
    content? : () => React.ReactNode
    multiple?: boolean,
    border? : boolean,
    disabled?: boolean
}

class CustomDropzone extends Component<Props> {
    render() {
        const { classes, onChange, maxFiles, filesLength, accept,content, multiple,border = true, disabled } = this.props
        return (
            <Dropzone
                maxFiles={maxFiles}
                accept={accept}
                onDropAccepted={(files: any) => onChange(files)}
                multiple={multiple}
                disabled={disabled}
            >
                {({ getRootProps, getInputProps, isDragAccept, isDragReject, draggedFiles }) => (
                    <div
                        className={
                            classNames(
                                classes.fileContainer,
                                border ? '' : classes.noborder,
                                isDragAccept ? classes.dragAccepted : '',
                                isDragReject ? classes.dragReject : '',
                                draggedFiles.length >= 1 ? classes.dragReject : '',
                                maxFiles && filesLength ?
                                    draggedFiles.length + filesLength > maxFiles ? classes.dragReject : ''
                                    : '',
                            )}
                        {...getRootProps()}
                    >
                        {
                            content && content()
                        }
                        <input type="file" id="banner" style={{ opacity: 0 }} onChange={(e)=> onChange(e.target.files)} {...getInputProps()} />
                    </div>
                )}
            </Dropzone>
        )
    }
}

export default withStyles(style)(CustomDropzone)
