export default (theme: any) => ({
    logoDragAccepted : {
        boxShadow : `0px 0px 5px 5px rgba(0,191,145,0.3)`
    },

    logoDragRejected : {
        boxShadow : `0px 0px 5px 5px rgba(231,34,34,0.3)`
    },

    dragAccepted: {
        borderColor: theme.palette.green.light,
        color: theme.palette.green.light
    },

    dragReject: {
        borderColor: theme.palette.red.light,
        color: theme.palette.red.light
    },
    fileContainer: {
        width: '100%',
        height: '100%',
        border: `1px dashed ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        flexDirection: 'column',
        padding: theme.spacing(2),
        '&:hover': {
            cursor: 'pointer'
        },
    },
    noborder:{
        border : 'none !important'
    }
}) as any