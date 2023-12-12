export default (theme: any) => ({
    menuitem: {
        fontSize: 14,
        textTransform: 'none',
        marginBottom: theme.spacing(1),
        borderRadius: 20,
    },
    buttontext: {
        fontSize: 14,
        fontWeight: 700,
        textTransform: 'none'
    },
    borderBottom: {
        borderBottom: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
        marginBottom: theme.spacing(1),
    },
    list: {
        padding: theme.spacing(2)
    },
    cancelbtnlabel: {
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
    },
    unpublish: {
        background: theme.palette.type === 'light' ? theme.palette.purple.primary.light : theme.palette.purple.primary.dark,
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        '&:hover': {
            background: theme.palette.type === 'dark' ? theme.palette.purple.primary.light : theme.palette.purple.primary.dark,
        },
    },
    delete: {
        background: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        '&:hover': {
            background: theme.palette.type === 'dark' ? theme.palette.red.light : theme.palette.red.dark,
        },
    },
    showcase: {
        background: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        '&:hover': {
            background: theme.palette.type === 'dark' ? theme.palette.green.light : theme.palette.green.dark,
        },
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        width: '100%',
    },
    savebtn: {
        marginLeft: theme.spacing(2)
    },
    paperWidthSm:{
        width : 600,
    }
}) as any