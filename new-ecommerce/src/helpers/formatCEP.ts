export function formatCEP(cep: string) {
    const match = cep.match(/^(\d{5})(-)?(\d{3})$/)
    if(match) {
      return [match[1], `${match[2] ? match[2] : "-"}`, match[3]].join("")
    }
}