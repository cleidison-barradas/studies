export default function getLeadStatus(status: string): string {
  switch (status) {
    case 'open':
      return 'Aberto'
    case 'pending':
      return 'Em Andamento'
    case 'closed':
      return 'Fechado'
    default:
      return 'Desconhecido'
  }
}
