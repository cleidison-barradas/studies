export default (theme: any) => ({
    row: {
        display: 'flex',
        alignItems: 'center',
        '& .MuiIconButton-root': {
            padding: '0px !important'
        }
    },
    title: {
        marginRight: theme.spacing(2),
        width: 75,
        marginLeft: theme.spacing(1),
    },
    promotionrow: {
        display: 'flex',
        width: '100%',
        borderBottom: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
        paddingBottom: theme.spacing(1),
        marginTop : theme.spacing(1),
        justifyContent: 'space-between',
        alignItems: 'center',
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
        backgroundColor: theme.palette.type === 'light' ? theme.palette.purple.primary.light : theme.palette.purple.primary.dark,
    },
    rowtitle:{
        marginLeft : theme.spacing(1)
    }
}) as any