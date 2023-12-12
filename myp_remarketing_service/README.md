# myp_remarketing_service

Este servico funciona como um cron job, retorna carrinhos deixados no site sem finalizar a compra
ele usa o model cartGlobal para salvar carrinhos do cliente,

O servico dispara 3 emails de abandono de carrinho

1 - email enviado com 15 min
2 - email enviado com 20 min 
3 - email enviado com 30 min

A qualquer momento que o cliente finalizar a compra uma flag no CartGlobal 'pruchased' = true é setada assim o carrinho do cliente em questão não será retornado para a fila de criacão de notificacões, sendo assim a qualquer nova interacão do cliente no site adicionando itens ao carrinho novos emails serão enviados não havendo a finalizacão da compra.

O servico também conta com outro worker responsavél por enviar notificacões para cliente que estão:

1 - a 15 dias sem realizar nova compra no site
2 - a 20 dias sem realizar nova compra no site
3 - a 30 dias sem realizar nova compra no site


vale observar a cada interacão do cliente comprando novamente ou adicionando itens no carrinho o servico reiniciará os envios.

Para que estes servicos funcionem é necessário que a loja ative no admin mypharma, 
