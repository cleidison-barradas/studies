export default (theme: any) =>
  ({
    dangertext: {
      color: theme.palette.type === 'light' ? theme.palette.red.light : theme.palette.red.dark,
    },
    paperroot: {
      borderRadius: 8,
    },
  } as any)
