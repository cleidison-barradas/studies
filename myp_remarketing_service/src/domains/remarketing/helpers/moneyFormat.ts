export default function (value: number) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
}