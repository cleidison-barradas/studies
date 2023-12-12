
const Erros: Record<string, string> = {
  cupom_not_found: 'cupom não encontrado!',
  cart_not_found: 'carrinho não encontrado!',
  document_already_exists: 'cpf já cadastrado!',
  internal_server_error: 'ocorreu um erro inesperado!',
  minimum_price_not_reached: 'valor mínimo não atingido!',
  cupom_usage_limit_reached: 'verifique as condicões para obter desconto!',
  authorization_items_failure: 'autorizacão dos produtos não pode ser concluída!',
  product_needs_membership: 'produto requer adesão no programa entre em contato com a Farmácia!',
  benefit_not_found: 'beneficio não encontrado!',
}

export function ErrorCodes(code: string = 'internal_server_error') {

  return Erros[code]
}
