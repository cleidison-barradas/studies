
type IStatusType = 'accepted' | 'rejected' | 'reversed' | 'payment_made'

const statusCommentsParsed: Record<IStatusType, string> = {
  accepted: 'Pagamento realizado',
  payment_made: 'Pagamento realizado',
  reversed: 'Pagamento estornado pelo gateway',
  rejected: 'Pagamento rejeitado pelo gateway',
}

interface RequestCommentServiceDTO {
  status: string
}

class CommentGenerateService {

  public generateComments({ status }: RequestCommentServiceDTO): string {

    return statusCommentsParsed[status]
  }
}

export default CommentGenerateService