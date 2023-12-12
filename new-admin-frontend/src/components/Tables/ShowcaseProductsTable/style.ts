export default (theme: any) => ({
  loadingcontainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tablecell: {
    borderBottom: 'none',
    padding: 0,
  },
  tablerow: {
    borderBottom: 'none',
  },
  table: {
    margin: 0,
    minWidth: 600,
  },
  avatar: {
    width: 24,
    height: 24,
    border: `1px solid ${theme.palette.type === 'dark' ? theme.palette.grey.primary.dark : theme.palette.grey.primary.light}`
  },
  price: {
    textAlign: 'end'
  },
}) as any