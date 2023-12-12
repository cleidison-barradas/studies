import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css' // eslint-disable-line no-unused-vars
import styles from './styles'
import classNames from 'classnames'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

import { CircularProgress } from '@material-ui/core'
import Formized from '../../components/Formized'
import { FormConsumer, FormProvider } from '../../context/FormContext'
import AboutUsInterface from '../../interfaces/aboutus'
import _ from 'lodash'
import { encode, decode } from 'html-entities'
import Base64 from '../../helpers/to-base-64'
import { RequestAddImage } from '../../services/api/interfaces/ApiRequest'
import File from '../../interfaces/file'
import { UploadImage } from '../../interfaces/uploadFile'
import buildImage from '../../helpers/buildImage'

type State = {
  initialState: {},
  data: {
    id: string | null
    initialData: any
    editor: any
    editorHTML: any
    showCode: boolean
  },
  imageUrl: string
}

type Props = {
  classes: any
  addAboutUs: (data: any) => void
  loadAboutUs: (id?: string, page?: any, limit?: any) => void
  uploadImage: ({ file, folder }: RequestAddImage) => Promise<File>
  aboutUs: AboutUsInterface[]
  fetching: boolean
  deletedId: string
  image: File | null
}

class Wysiwyg extends PureComponent<Props, State> {
  static defaultProps = {
    fetching: false,
    deletedId: '',
    image: null,
    aboutUs: null
  }

  constructor(props: any) {
    super(props)
    const editor = EditorState.createEmpty()
    this.state = {
      initialState: {},
      data: {
        id: null,
        initialData: '',
        editor,
        editorHTML: '',
        showCode: false,
      },
      imageUrl: ''
    }
  }
  onLoad = (id?: string, page?: any, limit?: any) => {
    const { loadAboutUs } = this.props
    loadAboutUs(id, page, limit)
  }
  componentDidMount() {
    this.setState((state: any) => ({
      ...state,
      initialState: { ...state.data },
    }))
    this.onLoad()
  }

  onEditorStateChange = (editor: any) => {
    const editorHTML = draftToHtml(convertToRaw(editor.getCurrentContent()))

    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        editor,
        editorHTML,
      },
    }))
  }

  onEditEditorHTML = (e: any) => {
    const editorHTML = e.target.value

    let editor: any
    const contentBlock = htmlToDraft(editorHTML)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      editor = EditorState.createWithContent(contentState)
    } else {
      editor = EditorState.createEmpty()
    }
    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        editor,
        editorHTML,
      },
    }))
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

  toggleEditorCode = () => {
    const {
      data: { showCode },
    } = this.state

    this.setState((state) => ({
      ...state,
      data: {
        ...state.data,
        showCode: !showCode,
      },
    }))
  }

  handleSave = (values: any) => {
    const { addAboutUs } = this.props
    addAboutUs({
      ...values,
      content: encode(values.content, { level: 'all' }),
    })
    this.onLoad()
  }

  UNSAFE_componentWillReceiveProps(newProps: any) {
    const { aboutUs, fetching } = newProps

    if (aboutUs && aboutUs.length > 0 && !fetching) {
      const { content, published, _id } = aboutUs[0]

      let editor: any
      const contentBlock = htmlToDraft(decode(content))

      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        editor = EditorState.createWithContent(contentState)
      } else {
        editor = EditorState.createEmpty()
      }
      this.setState((state) => ({
        ...state,
        published,
        data: {
          ...state.data,
          initialData: content,
          id: _id,
          editorHTML: content,
          editor,
        },
      }))
    }
  }

  render() {
    const { classes, fetching } = this.props
    const {
      data: { initialData, showCode, editor, editorHTML, id },
    } = this.state

    const ShowEditorCode = () => (
      <div className="rdw-option-wrapper" onClick={this.toggleEditorCode}>
        {showCode ? 'Ocultar' : 'Mostar'} Código
      </div>
    )

    return (
      <div className={classNames(classes.container, !showCode ? classes.editorHeightFix : '')}>
        <FormProvider>
          <FormConsumer>
            {({ form, onFormChange }) => {
              const values = {
                id: id ? id : null,
                content: editorHTML,
                published: true,
                ...form.aboutUs,
              }

              return (
                <Formized onFinish={() => this.handleSave(values)} name="aboutUs" onChange={onFormChange}>
                  {fetching ? (
                    <div className={classes.fetchingcontainer}>
                      <CircularProgress size={60} color="primary" />
                    </div>
                  ) : (
                    <React.Fragment>
                      <div>
                        <Editor
                          editorState={editor}
                          editorClassName={classes.textEditor}
                          toolbarClassName={classes.toolbarEditor}
                          onEditorStateChange={this.onEditorStateChange}
                          toolbarCustomButtons={[<ShowEditorCode key={''} />]}
                          editorStyle={{ display: showCode ? 'none' : '', minHeight: 300 }}
                          toolbar={{
                            image: {
                              uploadEnabled: true,
                              uploadCallback: this.uploadImageCallBack,
                              previewImage: true,
                            }
                          }}
                        />
                        {showCode && (
                          <textarea
                            value={values.content}
                            name="content"
                            className={classNames(classes.htmlEditor, classes.textEditor)}
                            onChange={this.onEditEditorHTML}
                          />
                        )}
                      </div>

                      <div className={classes.row} style={{ marginTop: '10px' }}>
                        <button
                          type="submit"
                          style={{ borderRadius: 25 }}
                          disabled={_.isEqual(initialData, values.content)}
                          className={classNames(classes.button, classes.saveButton)}
                        >
                          {fetching ? <CircularProgress color="primary" size={28} /> : 'SALVAR'}
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </Formized>
              )
            }}
          </FormConsumer>
        </FormProvider>
      </div>
    )
  }
}

export default withStyles(styles)(Wysiwyg)
