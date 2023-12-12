export default (theme: any) => ({
    tableroot: {
        minWidth: 500,
        '& tr':{
            borderBottom : 'none'
        },
        marginBottom : theme.spacing(1)
    },
    tablecellroot: {
        fontSize: 14,
        paddingLeft: 0,
        paddingTop : 0,
        paddingBottom : 8,
        borderBottom : 'none'
    },
    tableheadtxt: {
        fontSize: 14,
        color: theme.palette.primary.main,
        fontWeight: 'bold'
    }
}) as any