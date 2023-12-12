export default (theme: any) => ({
    caption:{
        color : theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        fontSize : 12,
        marginBottom : theme.spacing(2),
    },
    inputroot:{
        '& .MuiOutlinedInput-root':{
            borderRadius : 8,
        },
        '& .MuiInputLabel-formControl':{
            top : 14,

        },
        '& .MuiOutlinedInput-input':{
            padding : '20px 8px'
        }
    },
    row:{
        display : 'flex',
        alignItems : 'center',
        width: '60%',
        [theme.breakpoints.down('sm')]: {
            width : '100%'
        },
        flexWrap : 'wrap',
        justifyContent : 'space-between'
    },
    divisor : {
        marginTop : theme.spacing(2),
        marginBottom : theme.spacing(2),
    },
    comparerow:{
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    inputgroup:{
        width : '50%',
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'space-between'
    },
    formcontrolroot:{
        width : 120,
        marginRight : 20,
    },
    label:{
        fontSize:14,
    }
}) as any