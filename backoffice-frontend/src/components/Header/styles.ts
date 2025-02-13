import { Theme, createStyles } from '@material-ui/core'

import { fade, darken } from '@material-ui/core/styles/colorManipulator'
import { gradientBgLight, gradientBgDark } from '../../containers/Template/styles'

const drawerWidth = 240
const drawerBigWidth = 280

const styles = (theme: Theme) =>
    createStyles({
      appBar: {
        background: 'transparent',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin', 'background', 'backgroundImage'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        '& $menuButton': {
          color: theme.palette.secondary.light,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          zIndex: 10,
          height: 19
        },
        '&$left': {
          '& $menuButton': {
            marginLeft: 13
          },
          '& $headerTitle': {
            left: theme.spacing(2)
          }
        },
        '&$leftBig': {
          '& $menuButton': {
            marginLeft: 30,
            marginRight: theme.spacing(2),
            [theme.breakpoints.down('md')]: {
              marginLeft: 13
            }
          },
          '& $headerTitle': {
            left: theme.spacing(4)
          }
        },
        '&$right': {
          '& $menuButton': {
            marginRight: 13
          },
          '& $headerTitle': {
            right: theme.spacing(2)
          },
          '& > div': {
            flexDirection: 'row-reverse'
          },
          '& $flex': {
            textAlign: 'left'
          }
        }
      },

      badge: {
        top: 1,
        right: -5
      },
      attachedbar: {
        position: 'relative',
        '& $menuButton': {
          margin: `0 ${theme.spacing(2)}px`
        },
        '& $wrapper': {
          [theme.breakpoints.down('lg')]: {
            border: `1px solid ${theme.palette.divider}`
          }
        }
      },
      floatingBar: {
        position: 'fixed'
      },
      appMenu: {
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[3],
        [theme.breakpoints.down('md')]: {
          padding: `${theme.spacing(0.5)}px 0`
        },
        [theme.breakpoints.up('lg')]: {
          background: fade(theme.palette.background.paper, 0.8)
        },
        color: theme.palette.text.primary
      },
      flex: {
        flex: 1,
        textAlign: 'right'
      },
      flexDefault: {
        flex: 1,
        textAlign: 'right'
      },
      left: {},
      leftBig: {},
      right: {},
      appBarShift: {
        transition: theme.transitions.create(['width', 'margin', 'background'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        }),
        '&$left': {},
        '& $headerAction': {
          [theme.breakpoints.up('lg')]: {
            marginLeft: 320
          }
        },

        '&$leftBig': {
          '& $menuButton': {
            [theme.breakpoints.up('lg')]: {
              marginLeft: -20
            }
          },
          [theme.breakpoints.up('lg')]: {
            marginLeft: drawerBigWidth,
            width: `calc(100% - ${drawerBigWidth}px)`
          }
        },
        '&$right': {
          '& $menuButton': {
            [theme.breakpoints.up('lg')]: {
              marginRight: -20
            }
          },
          [theme.breakpoints.up('lg')]: {
            marginRight: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
          }
        },
        '& $menuButton': {
          color: theme.palette.primary.main
        },

        '&$darker': {
          '& $menuButton': {
            color: theme.palette.primary.dark
          }
        }
      },
      menuButtonWrapper: {},
      menuButton: {},
      hide: {
        display: 'none'
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
      },
      container: {
        display: 'flex',
        flexWrap: 'wrap'
      },
      dark: {},
      light: {},
      wrapper: {
        fontFamily: theme.typography.fontFamily,
        position: 'relative',
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(1),
        borderRadius: 22,
        display: 'inline-block',
        '&:hover': {
          background: fade(theme.palette.common.white, 0.25)
        },
        '&$light': {
          background: fade(theme.palette.common.white, 0.2)
        },
        '&$dark': {
          background:
                    theme.palette.type === 'dark' ? theme.palette.grey[700] : fade(theme.palette.common.white, 0.8),
          boxShadow: theme.shadows[10],
          '& input': {
            color: theme.palette.grey[700]
          },
          '& input::placeholder': {
            color: theme.palette.grey[400],
            opacity: 1 /* Firefox */
          },
          '& input:-ms-input-placeholder': {
            color: theme.palette.grey[400]
          },
          '& input::-ms-input-placeholder': {
            /* Internet Explorer 10-11 */ color: theme.palette.grey[400]
          }
        },
        '& $miniInput': {
          width: 70
        }
      },
      searchWrapper: {
        [theme.breakpoints.down('md')]: {
          flex: 1,
          textAlign: 'right'
        }
      },
      search: {
        width: theme.spacing(9),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
          display: 'none'
        }
      },
      miniInput: {
        paddingLeft: 0,
        textIndent: '999999px'
      },
      gradientBg: {},
      solidBg: {},
      darker: {
        backgroundAttachment: 'fixed',
        boxShadow: theme.shadows[3],
        '&$gradientBg': {
          backgroundImage: theme.palette.type === 'dark' ? gradientBgDark(theme) : gradientBgLight(theme)
        },
        '&$solidBg': {
          backgroundColor:
                    theme.palette.type === 'dark'
                      ? darken(theme.palette.primary.dark, 0.7)
                      : darken(theme.palette.white.light, 0.1)
        },
        '& $menuButton': {
          color: theme.palette.common.white
        }
      },
      fixed: {
        position: 'fixed',
        left: 0,
        top: 0,
        [theme.breakpoints.up('lg')]: {
          top: theme.spacing(1) * -8
        },
        '& nav': {
          padding: '16px 0'
        }
      },
      separatorV: {
        borderLeft: `1px solid ${theme.palette.grey[300]}`,
        height: 20,
        margin: '0 10px',
        opacity: 0.4
      },
      notifMenu: {
        '& li': {
          height: 'auto',
          '& h3': {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }
        }
      },
      badgeMenu: {
        '& span': {
          top: 0,
          right: -30
        }
      },
      textNotif: {
        '& span': {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          display: 'block'
        }
      },
      notifIcon: {
        '& svg': {
          width: 28,
          height: 28
        },
        '&$dark': {
          '& svg': {
            fill: theme.palette.text.primary
          }
        },
        '&$light': {
          '& svg': {
            fill: theme.palette.common.white
          }
        }
      },
      brand: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 20px 5px',
        height: 64,
        position: 'absolute',
        width: '100%',
        fontSize: 16,
        margin: 0,
        fontWeight: 500,
        textDecoration: 'none',
        color: theme.palette.text.primary,
        '& img': {
          marginRight: 10,
          width: 30
        }
      },
      mainMenu: {
        backgroundColor: theme.palette.background.paper,
        padding: `${theme.spacing(1)}px 0`,
        boxShadow: theme.shadows[3],
        position: 'relative',
        transition: 'padding 0.3s ease',
        '& > div': {
          display: 'flex',
          justifyContent: 'center'
        }
      },
      headMenu: {
        fontSize: 12,
        padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px ${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
        minHeight: 'auto',
        margin: `0 ${theme.spacing(0.5)}px`
      },
      opened: {
        color: theme.palette.primary.main,
        boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,
        '& svg': {
          fill: theme.palette.primary.main
        }
      },
      rightIcon: {
        marginLeft: theme.spacing(0.5),
        opacity: 0.3
      },
      selected: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.light,
        '&:hover': {
          background: theme.palette.primary.main
        },
        '& svg': {
          fill: theme.palette.primary.light
        },
        '& $rightIcon': {
          opacity: 0.7
        }
      },
      paperMenu: {
        overflow: 'auto',
        maxHeight: 500
      },
      popperClose: {
        pointerEvents: 'none',
        zIndex: 2
      },
      title: {
        fontSize: 10,
        textTransform: 'uppercase',
        display: 'block',
        color: theme.palette.secondary.main,
        lineHeight: '28px',
        fontWeight: 'bold',
        background: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius
      },
      dropDownMenu: {
        minWidth: 300,
        marginTop: theme.spacing(1.5),
        position: 'relative'
      },
      active: {},
      menuItem: {
        '& span': {
          fontSize: 14
        },
        '&$active': {
          borderLeft: `5px solid ${theme.palette.primary.main}`,
          backgroundColor:
                    theme.palette.type === 'dark'
                      ? fade(theme.palette.secondary.main, 0.24)
                      : theme.palette.secondary.light,
          '& span': {
            color: theme.palette.primary.main
          },
          '&:hover': {
            backgroundColor:
                        theme.palette.type === 'dark'
                          ? fade(theme.palette.secondary.main, 0.24)
                          : theme.palette.secondary.light
          }
        }
      },
      megaMenu: {
        padding: theme.spacing(2),
        '& $title': {
          paddingLeft: theme.spacing(2)
        }
      },
      megaItem: {
        display: 'inline-block',
        width: 'auto',
        margin: theme.spacing(1),
        padding: `${theme.spacing(0.25)}px ${theme.spacing(1)}px`,
        '& span': {
          fontSize: 14
        },
        '& div': {
          padding: 0
        },
        '&$active': {
          border: `1px solid ${theme.palette.primary.main}`,
          backgroundColor:
                    theme.palette.type === 'dark'
                      ? fade(theme.palette.secondary.main, 0.24)
                      : theme.palette.secondary.light,
          '& span': {
            color: theme.palette.primary.main
          },
          '&:hover': {
            backgroundColor:
                        theme.palette.type === 'dark'
                          ? fade(theme.palette.secondary.main, 0.24)
                          : theme.palette.secondary.light
          }
        }
      },
      bigIcon: {
        display: 'block',
        marginTop: 40,
        '& svg': {
          width: 100,
          height: 100,
          fill: theme.palette.primary.main,
          margin: '0 auto',
          display: 'inherit'
        }
      },
      button: {},
      headerProperties: {
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        zIndex: 1
      },
      fadeOut: {},
      invert: {},
      headerAction: {
        width: '100%',
        margin: `0 ${theme.spacing(3)}px`,
        transition: theme.transitions.create(['width', 'margin-left', 'background'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        }),
        paddingBottom: 5,
        '& $button': {
          margin: `0 ${theme.spacing(1)}px / 2`,
          '& svg': {
            fill: fade(theme.palette.common.white, 0.87),
            width: 28,
            height: 28
          }
        },
        '&$fadeOut': {
          opacity: 0
        },
        '&$invert': {
          '& $button': {
            '& svg': {
              fill: fade(theme.palette.text.primary, 0.5)
            }
          }
        }
      },
      searchIcon: {
        color: theme.palette.type === 'dark' ? theme.palette.white.dark : theme.palette.primary.main,
        position: 'absolute',
        top: 4,
        left: 5,
        width: 23,
        height: 23
      },
      headerSpacing: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15
      },
      userButtons: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: theme.spacing(5),
        paddingLeft: theme.spacing(2)
      },
      searchField: {
        borderRadius: 20,
        height: 32,
        paddingLeft: 20,
        backgroundColor: theme.palette.type === 'light' ? 'rgba(25, 153, 249, 0.15)' : 'rgba(92,185,255,0.15)',
        border: 'none',
        fontSize: 14,
        '& ::placeholder': {
          color: theme.palette.primary.main,
          opacity: 1
        }
      },
      show: {},
      headerTitle: {
        transition: 'all 0.3s ease',
        fontSize: theme.spacing(3),
        position: 'absolute',
        textTransform: 'capitalize',
        fontWeight: 700,
        top: 60,
        color: theme.palette.common.white,
        opacity: 0,
        '&$show': {
          top: theme.spacing(1),
          opacity: 0.87
        }
      },
      swipeDrawerPaper: {
        width: drawerWidth
      },
      searchHeaderMenu: {
        flex: 1,
        flexDirection: 'row-reverse',
        display: 'flex',
        alignItems: 'center'
      }
    }) as any

export default styles
