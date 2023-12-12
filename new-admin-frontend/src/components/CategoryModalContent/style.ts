export default (theme: any) => ({
    dialogPaperSm:{
        width : 600,
    },
    labelroot:{
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between',
        width : '100%',
    },
    treeitemroot:{
        marginTop : theme.spacing(2),
        paddingBottom : theme.spacing(1),
        borderBottom : `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark }`
    },
    childrow:{
        display : 'flex',
        alignItems : 'center'
    },
    categorycontainer:{
        marginBottom : theme.spacing(3)
    }
}) as any