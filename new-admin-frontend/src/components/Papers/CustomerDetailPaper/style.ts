export default (theme: any) => ({
    field: {
        fontSize: 14,
        color: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        fontWeight : 'bold'
    },
    value : {
        fontSize : 14,
    }
}) as any