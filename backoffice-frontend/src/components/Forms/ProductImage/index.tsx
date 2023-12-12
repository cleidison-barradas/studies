import {
    Button,
    ClickAwayListener,
    Grid,
    Grow,
    Paper,
    Popper,
    TextField,
    Typography,
    withStyles,
} from '@material-ui/core'
import React, { Component } from 'react'
import PaperBlock from '../../PaperBlock'
import { ReactComponent as CloudIcon } from '../../../assets/images/icons/blueCloudUploader.svg'
import CustomDropzone from '../../CustomDropzone'
import DeleteIcon from '@material-ui/icons/Delete'
import Base64 from '../../../helpers/to-base-64'
import { Field, FieldProps } from 'formik'
import styles from './styles'
import { BucketS3 } from '../../../config'

type Props = {
    classes: Record<keyof ReturnType<typeof styles>, string>
}

type State = {
    open: boolean
}

class ProductImage extends Component<Props, State> {
    private anchorRef: React.RefObject<HTMLButtonElement>

    constructor(props: any) {
        super(props)

        this.state = {
            open: false,
        }

        this.anchorRef = React.createRef()
        this.handleToggle = this.handleToggle.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleToggle() {
        this.setState({
            ...this.state,
            open: !this.state.open,
        })
    }

    handleClose() {
        this.setState({
            ...this.state,
            open: false,
        })
    }

    handleImage = async (files: any) => {
        const base64 = await Base64(files)

        const image = {
            name: files[0].name,
            type: files[0].type,
            url: URL.createObjectURL(files[0]),
            content: base64[0],
        }

        return image
    }

    content = () => {
        const { classes } = this.props
        return (
            <React.Fragment>
                <CloudIcon />
                <Typography className={classes.uploadertext}>Clique ou solte a imagem aqui para carregar</Typography>
            </React.Fragment>
        )
    }

    render() {
        const { classes } = this.props
        const { open } = this.state

        return (
            <Field name="image">
                {({ form }: FieldProps) => (
                    <PaperBlock>
                        <Grid container alignItems="center" justify="space-between">
                            <Typography className={classes.title} style={{ marginBottom: '0px' }}>
                                Imagem
                            </Typography>

                            <Popper
                                open={open}
                                anchorEl={this.anchorRef.current}
                                role={undefined}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={this.handleClose}>
                                                <TextField variant="outlined" label="url" />
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </Grid>
                        <div className={classes.imagesrow}>
                            <div className={classes.image}>
                                <CustomDropzone
                                    onChange={async (file) => {
                                        const image = await this.handleImage(file)
                                        form.setFieldValue('image', image)
                                    }}
                                    multiple={false}
                                    accept="image/jpeg,image/png"
                                    content={this.content}
                                    maxFiles={1}
                                />
                            </div>
                            {form.values.image ? (
                                <Button
                                    className={classes.image}
                                    style={{
                                        backgroundImage: `url(${
                                            form.values.image?.key
                                                ? `${BucketS3}/${form.values.image?.key}`
                                                : form.values.image?.url
                                        })`,
                                    }}
                                    onClick={() => {
                                        form.setFieldValue('image', null)
                                    }}
                                >
                                    <DeleteIcon className={classes.deleteicon} />
                                </Button>
                            ) : null}
                        </div>
                    </PaperBlock>
                )}
            </Field>
        )
    }
}

export default withStyles(styles)(ProductImage)
