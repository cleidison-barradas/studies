export default (theme: any) =>
  ({
    tableroot: {
      minWidth: 500,
      '& tr': {
        borderBottom: 'none',
      },
      marginBottom: theme.spacing(1),
    },
    tablecellcenter: {
      fontSize: 14,
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 8,
      borderBottom: 'none',
      textAlign: 'center',
    },
    tablecellroot: {
      fontSize: 14,
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 8,
      borderBottom: 'none',
      textAlign: 'justify',
    },
    tableheadtxt: {
      fontSize: 14,
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      textAlign: 'justify',
    },
  } as any)
