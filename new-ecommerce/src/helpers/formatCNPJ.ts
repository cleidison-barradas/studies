export function formatCNPJ(cnpj: string | undefined) {
  if(cnpj === undefined) return ''
  const onlyNumCNPJ = cnpj.replace(/\D/g,'')
  const firstPart = onlyNumCNPJ.slice(0, 2)
  const secondPart = onlyNumCNPJ.slice(2, 5)
  const thirdPart = onlyNumCNPJ.slice(5, 8)
  const fourthPart = onlyNumCNPJ.slice(8, 12)
  const fifthPart = onlyNumCNPJ.slice(12, 14)
  return `${firstPart}.${secondPart}.${thirdPart}/${fourthPart}-${fifthPart}`
}