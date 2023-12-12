export default (theme: any) => ({
    link: {
        color: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(2),
        '& svg': {
            marginRight: theme.spacing(1)
        }
    },
    footer: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btngroup: {
        '& button + button': {
            marginLeft: theme.spacing(2)
        }
    },
    boldtext: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    caption: {
        fontSize: 14,
    },
    checkicon: {
        fontSize: 60,
    },
    icontainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.green.dark
    },
    textseparator: {
        width: '100%',
        height: '100%',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
    },
    error: {
        color: `${theme.palette.red.dark} !important`
    }
}) as any