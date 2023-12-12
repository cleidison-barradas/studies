export default (theme: any) => ({
    inputGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    select: {
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
        '& .MuiSelect-icon': {
            color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        }
    },
    formControl: {
        width: '29%',
        '& .MuiInputBase-root': {
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
        },
        '& .MuiFormLabel-root': {
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
        },
        '& .MuiInputLabel-shrink': {
            color: `${theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark} !important `,
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            maxWidth: 'none',
            marginBottom: theme.spacing(3)
        },
    },
    wrapper: {
        marginTop: theme.spacing(4)
    },
    neighborhood: {
        '& .MuiInputBase-root': {
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
        },
        '& .MuiFormLabel-root': {
            color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
        },
        '& .MuiInputLabel-shrink': {
            color: `${theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark} !important `,
        },
        width: '39%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
    neighborhoodinput: {
        height: 47,
        color: theme.palette.type === 'light' ? theme.palette.black.primary.light : theme.palette.black.primary.dark,
    },
    endadorment: {
        top: -10,
        '& .MuiSvgIcon-root': {
            color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark
        },
    },
    chip: {
        padding: '8px 10px !important',
        marginBottom: 6,
    },
    checkboxlabel: {
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        fontWeight: '400',
        fontSize: 12,
    },
    newneighborhood: {
        color: theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark,
        fontWeight: '400',
        fontSize: 12,
    },
    columninput: {
        width: '100%',
        maxWidth: 86,
        height: 36,
        borderRadius: 20,
        background: 'transparent',
        border: `1px solid ${theme.palette.type === 'light' ? theme.palette.grey.primary.light : theme.palette.grey.primary.dark}`,
        padding: 5,
        '&:focus': {
            borderColor: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark
        }
    },
    inputName: {
        weight: '400',
        fontSize: 14,
        marginBottom: theme.spacing(2)
    },
    mobilecenter: {
        [theme.breakpoints.down('sm')]: {
            width: '49%',
            justifyContent: 'space-between'
        },
    },
    valuesinputs: {
        width: '80%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
        marginTop: '0px',
        marginBottom: theme.spacing(4)
    },
    saveButton: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.dark,
        marginBottom: theme.spacing(3),
        color: theme.palette.type === 'light' ? theme.palette.white.light : theme.palette.white.dark,
        fontSize: 14,
        borderRadius: 20,
        paddingLeft: 40,
        paddingRight: 40,
    },
    fetchingcontainer:{
      width: '100%',
      height: '90%',
      display : 'flex',
      justifyContent : 'center',
      alignItems : 'center',
  },
}) as any