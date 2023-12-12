export default (theme: any) => ({
    value:{
        fontSize : 20,
    },
    up:{
        color: theme.palette.type === 'light' ? theme.palette.green.light : theme.palette.green.dark,
    },
    down:{
        color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    },
    percentage : {
        fontSize : 14,
    }
}) as any