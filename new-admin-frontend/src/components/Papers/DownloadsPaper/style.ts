export default (theme: any) => ({
    nopointer: {
        cursor: 'auto !important',
    },
    download: {
        display: 'none',
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        cursor: 'pointer',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        textDecoration: 'none',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    item: {
        width: '100%',
        height: 240,
        position: 'relative',
        borderRadius: 20,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
        justifyContent: 'center',
        '&:hover': {
            border: `4px solid ${theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark}`,
            boxShadow: '5px 25px 30px 5px rgba(0, 0, 0, 0.15)',
            '& $download': {
                position: 'absolute',
                display: 'flex',
            },
        },
    },
    title: {
        fontSize: 20,
        marginBottom: theme.spacing(2)
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
        fontSize: 18,
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    description: {
        fontSize: 14,
        textAlign: 'justify',
        marginTop : theme.spacing(2)
    }
}) as any