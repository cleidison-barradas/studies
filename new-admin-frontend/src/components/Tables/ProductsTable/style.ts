export default (theme: any) =>
({
    cellrowroot: {
        borderBottom: 'none',
    },
    rowroot: {
        borderBottom: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
            }`,
        borderTop: 'none',
    },
    rowrootselected: {
        borderBottom: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
            }`,
        borderTop: 'none',
        backgroundColor: theme.palette.type === 'light' ? 'rgba(36, 128, 255, 0.1)' : 'rgba(76, 145, 195, 0.1)',
    },
    tableHeadTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },
    row: {
        borderBottom: 'none',
        height: 120,
    },
    headcell: {
        borderBottom: 'none',
    },
    image: {
        width: 82,
        height: 82,
        border: `1px solid ${theme.palette.grey.primary.light}`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: 4,
    },
    productrow: {
        display: 'flex',
        alignItems: 'center',
    },
    productcolumn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: theme.spacing(3),
    },
    text: {
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
        textDecoration: 'none',
    },
    gotoicon: {
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
    },
    statuscontainer: {
        borderRadius: 20,
        padding: 5,
        height: 36,
        width: 164,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiTypography-root': {
            color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        },
        transition: theme.transitions.create('backgroundColor', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    statustext: {
        fontSize: 14,
    },
    statustrue: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
    },
    statusfalse: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        '& .MuiIconButton-root.Mui-disabled': {
            color: theme.palette.type === 'light' ? theme.palette.grey.primary.dark : theme.palette.grey.primary.light,
        },
    },
    buttongroup: {
        marginTop: theme.spacing(2),
    },
    visible: {
        display: '',
    },
    invisible: {
        display: 'none',
    },
    button: {
        fontWeight: 500,
        fontSize: 14,
        textTransform: 'none',
    },
    checkbox: {
        padding: '0px',
        marginRight: theme.spacing(1),
    },
    fetchingcontainer: {
        width: '100%',
        height: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabs: {
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        '& .MuiTab-root': {
            minWidth: '0',
            marginRight: theme.spacing(4),
            textTransform: 'none',
            fontSize: 20,
            fontWeight: 'normal',
        },
        '& .MuiTabs-flexContainer': {
            borderBottom: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
                }`,
        },
    },
    indicator: {
        height: 2,
    },
    autocomplete: {
        '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
            padding: 0,
        },
    },
    tags: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(3),
        width: '100%',
        overflowX: 'auto',
    },
    tag: {
        marginRight: theme.spacing(1),
    },
    iconhelp: {
        fontSize: 16,
        color: '#B8C5D0',
        marginLeft: 5,
    },
    virtualTab: {
        color: '#F03E3E',
       /* display: 'flex',
        alignItens: 'flex-start'*/
    },
    virtualTabAlertIcon: {
        verticalAlign: 'top',
        marginLeft: '8px'
    }
} as any)
