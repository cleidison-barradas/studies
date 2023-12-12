export const floatToBRL = (float: number) => {
  if (float === undefined) return 'R$ 0,00'
  const money = float.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `R$ ${money}`
}