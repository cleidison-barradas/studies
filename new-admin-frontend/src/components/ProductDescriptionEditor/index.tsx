import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css' // eslint-disable-line no-unused-vars
import classNames from 'classnames'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import style from './style'
import { Field } from 'formik'
import Product from '../../interfaces/product'
import { encode } from 'html-entities'
import { UploadImage } from '../../interfaces/uploadFile'
import buildImage from '../../helpers/buildImage'
import Base64 from '../../helpers/to-base-64'
import { RequestAddImage } from '../../services/api/interfaces/ApiRequest'
import File from '../../interfaces/file'

type State = {
    editor: any
    showCode: boolean
    loaded: boolean
}

type Props = {
    classes: any
    image: File | null
    setDescription: (value: any) => void
    uploadImage: ({ file, folder }: RequestAddImage) => Promise<File>
    description: Product['description']
}

class ProductDescriptionEditor extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            editor: EditorState.createEmpty(),
            showCode: false,
            loaded: false,
        }
    }

    onEditorStateChange = (editor: any) => {
        const { setDescription } = this.props
        this.setState(
            {
                ...this.state,
                editor,
            },
            () => setDescription(encode(draftToHtml(convertToRaw(editor.getCurrentContent())), { level: 'all' }))
        )
    }

    onEditEditorHTML = ({ target: { value } }: any) => {
        const editorHTML = value

        let editor: any
        const contentBlock = htmlToDraft(editorHTML)

        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            editor = EditorState.createWithContent(contentState)
        } else {
            editor = EditorState.createEmpty()
        }

        this.setState((state: any) => ({
            ...state,
            editor,
            editorHTML,
        }))
    }

    toggleEditorCode = () => {
        const { showCode } = this.state

        this.setState({
            showCode: !showCode,
        })
    }

    setEditor = (editor: any) => {
        this.setState({
            ...this.state,
            editor,
        })
    }

    ShowEditorCode = () => {
        const { showCode } = this.state
        return (
            <div className="rdw-option-wrapper" onClick={this.toggleEditorCode}>
                {showCode ? 'Não mostrar' : 'Mostrar'} Código
            </div>
        )
    }

    componentDidUpdate(prevProps: Props) {
        const { description } = this.props
        const { loaded } = this.state

        if (description && description !== prevProps.description && !loaded) {
            const { contentBlocks, entityMap } = htmlToDraft(description)
            if (contentBlocks) {
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
                this.setState({
                    ...this.state,
                    editor: EditorState.createWithContent(contentState),
                    loaded: true,
                })
            }
        }
    }

    uploadImageCallBack = async (img: UploadImage) => {
      const content = await Base64(img)
      const { uploadImage } = this.props

      const file = buildImage(img)
      file.content = content

      const imageUrl =  await uploadImage({ folder: "assets", file})
      const data = { link: imageUrl.image.url }
      return { data }
    }

    render() {
        const { showCode, editor } = this.state

        const { classes } = this.props

        return (
            <div className={classNames(classes.container, !showCode ? classes.editorHeightFix : '')}>
                <div style={{ height: '100%' }}>
                    <Editor
                        editorState={editor}
                        editorClassName={classes.textEditor}
                        toolbarClassName={classes.toolbarEditor}
                        onEditorStateChange={this.onEditorStateChange}
                        toolbarCustomButtons={[<this.ShowEditorCode key={''} />]}
                        editorStyle={{ display: showCode ? 'none' : '' }}
                        toolbar={{
                          image: {
                            uploadEnabled: true,
                            uploadCallback: this.uploadImageCallBack,
                            previewImage: true,
                          }
                        }}
                    />
                    {showCode && (
                        <div className={classes.textareawrapper}>
                            <Field
                                name="description"
                                as="textarea"
                                className={classNames(classes.htmlEditor, classes.textEditor)}
                                rows={3}
                            />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default withStyles(style)(ProductDescriptionEditor)
