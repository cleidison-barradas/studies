export default (theme: any) =>
    ({
        emptyContainer: {
            width: '100%',
            height: '90%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },

        link: {
            width: 235,
            height: 32,
            background: theme.palette.primary.light,
            borderRadius: 20,
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },

        title: {
            fontSize: 24,
            borderBottom: `1px solid ${
                theme.palette.type === 'dark' ? theme.palette.grey.primary.dark : theme.palette.black.primary.light
            }`,
            paddingBottom: 10,
            boxSizing: 'border-box',
        },

        table: {
            margin: 0,
            width: '100%',
            minWidth: 450,
            '& tr > th': {
                fontSize: 14,
                margin: 0,
                padding: 0,
                paddingBottom: 15,
                fontWeight: 'bold',
            },
            '& tr > th:last-child': {
                textAlign: 'center',
            },
            '& tr': {
                border: 'none',
            },
        },

        tr: {
            height: 40,
        },

        tbody: {
            fontSize: 12,
            paddingTop: 20,
            '& tr > td': {
                margin: 0,
                padding: 0,
                paddingTop: 8,
                marginBottom: 10,
            },
        },

        id: {
            fontSize: 12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            paddingRight: theme.spacing(1),
        },

        loadingcontainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },

        status: {
            paddingTop: 2,
            borderRadius: 20,
            padding: 25,
            fontSize: 14,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            color: 'white',
            height: 30,
        },

        default: {
            background: theme.palette.primary.main,
        },

        accepted: {
            background: theme.palette.green.dark,
        },

        paid: {
            background: '#00BF91',
        },

        refund: {
            background: '#E72222',
        },

        delivered: {
            background: theme.palette.primary.dark,
        },

        buttonContainer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 5,
        },

        button: {
            width: '50%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            color: 'black',
            background: 'transparent',
            fontSize: 12,
            fontWeight: 'normal',
            textDecoration: 'none',
            '& p': {
                margin: 0,
            },

            '& img': {
                marginLeft: 10,
                filter: 'brightness(0)',
            },
        },

        overflow: {
            maxHeight: '85%',
            overflow: 'auto',
            borderBottom: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
            '&::-webkit-scrollbar': {
                width: 6,
            },

            '&::-webkit-scrollbar-track': {
                background: 'transparent',
            },

            '&::-webkit-scrollbar-thumb': {
                background: theme.palette.grey.primary.dark,
            },
        },

        hr: {
            margin: 0,
            marginTop: 5,
            padding: 0,
            borderColor: theme.palette.type === 'dark' ? theme.palette.grey.primary.dark : theme.palette.black.primary.light,
        },

        total: {
            fontSize: 12,
        },

        name: {
            width: '200px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 12,
            [theme.breakpoints.down('sm')]: {
                width: 78,
            },
            [theme.breakpoints.down('md')]: {
                width: 78,
            },
        },
    } as any)
