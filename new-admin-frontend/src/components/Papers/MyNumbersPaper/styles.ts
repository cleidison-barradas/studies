export default (theme: any) =>
    ({
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },

        title: {
            fontSize: 18,
        },

        empty: {
            fontSize: 24,
            color: theme.palette.white.primary,
            opacity: 0.25,
        },

        hr: {
            margin: '0px',
            opacity: 0.3,
        },

        row: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            borderBottom: '1px dashed white',
            marginLeft: theme.spacing(1),
            textDecoration: 'none',
            color: 'white',
        },

        space: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            paddingRight: theme.spacing(2),
            alignItems: 'center',
            '& img': {
                height: 15,
            },
        },

        description: {
            margin: 0,
            marginBottom: 3,
            marginTop: 3,
            fontSize: 18,
        },

        value: {
            margin: 0,
            marginBottom: 5,
            fontSize: 28,
        },

        select: {
            background: 'transparent',
            width: '30%',
            border: 'none',
            outline: 'none',
            color: 'white',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },

        loadingcontainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    } as any)