export default (theme: any) => ({
    tableroot:{
        minWidth : 450
    },
    tablecellroot:{
        fontSize : 14,
        paddingLeft : 0,
    },
    tableheadtxt:{
        fontSize : 14,
        color : theme.palette.primary.main,
        fontWeight : 'bold'
    },
    fetchingcontainer: {
      with: '100%',
      height: '90%',
      display: 'flex',
      justifyContent: 'center'
    },
    rejectedRow: {
        fontSize : 14,
        backgroundColor: 'rgba(251, 2, 52, 0.16)',
      },
    rejectedCommentText:{
        fontSize : 14,
        color : '##727079',
        fontWeight: '200',
        paddingTop: '5px'
    },
    docasRejectedStatusText:{
        marginTop: '20%'
    }
}) as any