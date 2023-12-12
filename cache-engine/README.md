# cache engine
Worker responsável por reindexar dados de pesquisa do ElastiSearch

## Como funciona
- Quando dispara algo na queue "mongo-invalidate-product", roda o reindex da cache-engine.
- O elastic search fica atualizado
- A search-engine (https://github.com/mypharmabr/search-api) consegue fazer a busca atualizada
- :)

## Quem chama a fila?
- Qualquer serviço que altera produtos