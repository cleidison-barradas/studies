export default (theme: any) => ({

    container: {
        height: '100%',
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'space-between',
    },

    editorHeightFix: {
        '& .rdw-editor-wrapper': {
            height: '100%'
        }
    },
    toolbarEditor: {
        background: theme.palette.white.dark,
        border: `1px solid ${theme.palette.grey.primary.dark}`,
    },

    textEditor: {
        paddingLeft: theme.spacing(2),
        border: `1px solid ${theme.palette.grey.primary.dark}`,
        background: theme.palette.white.dark,
        [theme.breakpoints.down('sm')]: {
            height: 300,
        },
        color : 'black'
    },
    htmlEditor: {
        height: '80%',
        width: '100%',
        fontSize : 18,
        padding : theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            height: 300,
        },
        resize : 'none'
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            marginTop: 60,
        },
    },

    button: {
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        fontSize: 14,
        width: 150,
        marginRight: 20,
    },

    saveButton: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
    },

    publishButton: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark
    },
    fetchingcontainer:{
        width: '100%',
        height: '100%',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
    },

}) as any