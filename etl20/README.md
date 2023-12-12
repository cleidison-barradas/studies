# ETL 2.0
ETL 2.0 é a mais nova integração entre os serviços do MyPharma com ERPs das fármacias, a integração foi desenvolvida para ser de fácil implementação e com o mínimo de configuração possível.

---

# Requesitos
- NodeJS 8 ou superior

# Compilação
- Primeiramente é necessário configurar o `config.json` com informações do ambiente no qual o ETL irá trabalhar.
*Obs:* `installation_folder` é o diretório onde os executavéis estarão!!!

- Após configurar o ambiente, vamos compilar. É necessário compilar os dois módulo, `etl-login` e `etl-core`, ambas as compilações irão gerar os executavéis dos módulos, onde os mesmos seviram para instalar respectivamente.
- Assim que compilar e instalar os módulos, é obrigatório deixar os executáveis dos módulos em uma única pasta que foi anteriormente informada no `config.json`
- Enfim, agora basta rodar!

---
## Depois que os módulos estiverem funcionando corretamente, é necessário criar uma tarefa para rodar o módulo Core a cada 24h no mínimo. Recomendo rodar a cada 1h para manter a integridade dos produtos no ecommerce.