import { Box, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Field, FieldArray, FieldProps } from 'formik'
import { Component } from 'react'
import Dropzone from 'react-dropzone'
import { AuthConsumer } from '../../context/AuthContext'
import toBase64 from '../../helpers/to-base-64'
import Banner from '../../interfaces/banner'
import TextFormField from '../TextFormField'
import styles from './styles'

export type BannerRegisterType = 'text' | 'image'

type Props = {
  type?: BannerRegisterType
  history?: any
  store: any
  classes: Record<keyof ReturnType<typeof styles>, string>
}

class BannersUploader extends Component<Props> {
  formatBanner = async (value: any) => {
    const banners = Promise.all(
      value.map(async (banner: any) => {
        if (!banner.image) {
          const base64 = await toBase64(banner)
          return {
            image: {
              name: banner.name,
              type: banner.type,
              url: URL.createObjectURL(banner),
              content: base64,
            },
            url: banner.url,
          }
        } else {
          return banner
        }
      })
    ).then((updated: any) => {
      return updated
    })
    return banners
  }

  render() {
    const { classes, type = 'image', history, store } = this.props

    return (
      <FieldArray
        name="banners"
        render={({ form, remove, push }) => {
          const { banners } = form.values

          const bannerLimit = type === 'text' ? 6 : 4

          return (
            <div className={classNames(classes.section)}>
              <p className={classes.subtitle}>Banners</p>
              <AuthConsumer>
                {({ store }) => (
                  <p className={classes.caption}>
                    (Carrega até {bannerLimit} imagens, no tamanho máximo indicado de{' '}
                    {store?.settings.config_new_layout === true ? '350 x 200px' : '1200px x 200px'} cada)
                  </p>
                )}
              </AuthConsumer>
              {banners.map((_: Banner, index: any) => (
                <Box key={index} mt={1} mb={1}>
                  <Field name={`banners[${index}]`} key={index}>
                    {({ field: { value } }: FieldProps) => (
                      <button
                        className={classNames(classes.fileContainer, classes.bannerContainer)}
                        style={{
                          backgroundImage: `url(${
                            type === 'text'
                              ? require(`../../assets/images/ilustration/${value?.image?.url}`).default
                              : value?.image?.url
                          })`,
                        }}
                        onClick={(e) => {
                          if (type === 'text') {
                            e.preventDefault()

                            history.push({
                              pathname: '/store/layout/text-banner',
                              state: {
                                store,
                                banner: value,
                              },
                            })
                          } else {
                            remove(index)
                          }
                        }}
                      >
                        <div className={classes.overlay} />
                        <p className={classes.bannerActionText}> {type === 'text' && 'Editar banner'}</p>
                        <img
                          src={
                            require(type === 'text'
                              ? '../../assets/images/whiteEditIcon.svg'
                              : '../../assets/images/whiteTrash.svg').default
                          }
                          alt=""
                          className={classes.bannerActionIcon}
                        />
                      </button>
                    )}
                  </Field>

                  {type === 'image' && (
                    <Field component={TextFormField} label="URL de destino (opcional)" name={`banners[${index}].url`} />
                  )}
                </Box>
              ))}
              {type === 'image' && banners.length < bannerLimit && (
                <Dropzone
                  accept="image/png,image/jpeg"
                  maxFiles={4}
                  onDrop={async (acceptedFiles) => {
                    const banner = await this.formatBanner(acceptedFiles)
                    push(banner)
                  }}
                >
                  {({ getRootProps, getInputProps, isDragAccept, isDragReject, draggedFiles }) => (
                    <label
                      className={classNames(
                        classes.fileContainer,
                        isDragAccept ? classes.dragAccepted : '',
                        isDragReject ? classes.dragReject : '',
                        draggedFiles.length >= 5 ? classes.dragReject : '',
                        draggedFiles.length + banners.length > 4 ? classes.dragReject : ''
                      )}
                      {...getRootProps()}
                      htmlFor="banner"
                    >
                      <img src={require('../../assets/images/blueCloudUploader.svg').default} alt="" />
                      <input
                        type="file"
                        className={classes.fileInput}
                        id="banner"
                        onChange={async (e: any) => {
                          const updatedBanners = await this.formatBanner([e.target.files[0]])
                          push(updatedBanners[0])
                        }}
                        {...getInputProps}
                      />
                      {type === 'image' && (
                        <>
                          {isDragAccept && draggedFiles.length <= 4 && draggedFiles.length + banners.length < 5 ? (
                            <p className={classNames(classes.fileText, classes.dragAccepted)}>
                              Solte as imagens para adiciona-las
                            </p>
                          ) : (
                            ''
                          )}
                          {!isDragReject && !isDragAccept && draggedFiles.length <= 4 ? (
                            <p className={classes.fileText}>Clique aqui e faça Upload do seu Banner</p>
                          ) : (
                            ''
                          )}
                          {isDragReject ? (
                            <p className={classNames(classes.fileText, classes.dragReject)}>Somente imagens</p>
                          ) : (
                            ''
                          )}
                          {draggedFiles.length >= 5 || draggedFiles.length + banners.length > 4 ? (
                            <p className={classNames(classes.fileText, classes.dragReject)}>Máximo de 4 banners</p>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                    </label>
                  )}
                </Dropzone>
              )}
            </div>
          )
        }}
      />
    )
  }
}

export default withStyles(styles)(BannersUploader)
