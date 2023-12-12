export const floatToBRL = (float: number) => {
  if (float === null) return 'R$ -'
  const money = float.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `R$ ${money}`
}
