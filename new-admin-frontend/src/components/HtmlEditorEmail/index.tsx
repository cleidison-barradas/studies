import React, { Component } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import { Box, withStyles } from '@material-ui/core'
import { Field } from 'formik'
import htmlToDraft from 'html-to-draftjs'
import styles from './styles'
import classNames from 'classnames'
import { encode } from 'html-entities'
import Base64 from '../../helpers/to-base-64'
import { RequestAddImage } from '../../services/api/interfaces/ApiRequest'
import File from '../../interfaces/file'
import { UploadImage } from '../../interfaces/uploadFile'
import buildImage from '../../helpers/buildImage'

interface State {
  loaded: boolean
  showCode: boolean
  editorState: EditorState
}

interface Props {
  message: string
  image: File | null
  onChange: (content: any) => void
  uploadImage: ({ file, folder }: RequestAddImage) => Promise<File>
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class HtmlEditorEmail extends Component<Props, State> {
  state: State = {
    showCode: false,
    loaded: false,
    editorState: EditorState.createEmpty(),
  }

  componentDidUpdate(prevProps: Props) {
    const { message } = this.props

    if (message && message !== prevProps.message && !this.state.loaded) {
      const { contentBlocks, entityMap } = htmlToDraft(message)

      if (contentBlocks) {
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
        const editorState = EditorState.createWithContent(contentState)

        this.setState((state: any) => ({
          ...state,
          editorState,
          loaded: true
        }))
      }
    }
  }

  onChangeEditor = (editorState: EditorState) => {
    const { onChange } = this.props

    this.setState(
      {
        editorState,
      },
      () => {
        onChange(encode(draftToHtml(convertToRaw(editorState.getCurrentContent())), { level: 'all' }))
      }
    )
  }

  ShowEditorCode = () => {
    const { showCode } = this.state
    return (
      <div className="rdw-option-wrapper" onClick={() => this.setState({ showCode: !showCode })}>
        {showCode ? 'Não mostrar' : 'Mostrar'} Código
      </div>
    )
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
    const { classes } = this.props
    const { editorState, showCode } = this.state

    return (
      <Box className={classNames(classes.container, !showCode ? classes.editorHeightFix : '')}>
        <Box width="100%">
          <Editor
            editorState={editorState}
            editorClassName={classes.textEditor}
            toolbarClassName={classes.toolbarEditor}
            onEditorStateChange={this.onChangeEditor}
            editorStyle={{ display: showCode ? 'none' : '' }}
            toolbarCustomButtons={[<this.ShowEditorCode key={1} />]}
            toolbar={{
              image: {
                uploadEnabled: true,
                uploadCallback: this.uploadImageCallBack,
                previewImage: true,
              }
            }}
          />
          {showCode && (
            <Box className={classes.textareawrapper}>
              <Field name="automations.message" as="textarea" rows={3} className={classNames(classes.htmlEditor, classes.textEditor)} />
            </Box>
          )}
        </Box>
      </Box>
    )
  }
}

export default withStyles(styles)(HtmlEditorEmail)
