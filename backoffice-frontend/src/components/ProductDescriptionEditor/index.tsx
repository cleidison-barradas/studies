import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css' // eslint-disable-line no-unused-vars
import classNames from 'classnames'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import styles from './styles'
import { Field } from 'formik'
import Product from '../../interfaces/product'

type State = {
    editor: any
    editorHTML: any
    showCode: boolean
    loaded: boolean
}

type Props = {
    classes: any
    setDescription: (value: any) => void
    description: Product['description']
}

class ProductDescriptionEditor extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {
            editor: EditorState.createEmpty(),
            editorHTML: '',
            showCode: false,
            loaded: false,
        }
    }

    onEditorStateChange = (editor: any) => {
        const { setDescription } = this.props
        const editorHTML = draftToHtml(convertToRaw(editor.getCurrentContent()))
        this.setState(
            (state: any) => ({
                ...state,
                editor,
                editorHTML,
            }),
            () => {
                setDescription(this.state.editorHTML)
            }
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
            if (description) {
                const contentBlock = htmlToDraft(description)
                if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                    this.setState({
                        ...this.state,
                        editor: EditorState.createWithContent(contentState),
                        loaded: true,
                    })
                }
            }
        }
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
                        editorStyle={{ display: showCode ? 'none' : '', height: '80%', minHeight: 450 }}
                    />
                    {showCode && (
                        <div className={classes.textareawrapper}>
                            <Field name="description" className={classNames(classes.htmlEditor, classes.textEditor)} />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ProductDescriptionEditor)
