export default (theme: any) => ({
    caption : {
        textAlign : 'justify',
        fontSize : 14,
    },
    exporttext:{
        marginTop: theme.spacing(2),
        fontSize : 14,
        fontWeight : 700,
    },
    radiogroup:{
        '& .MuiTypography-root':{
            fontSize : 14,
        }
    },
    link : {
        color : theme.palette.type === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
        textDecoration : 'none',
        fontWeight : 500,
    }
}) as any