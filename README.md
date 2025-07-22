# Setup

✅ Vitest
✅ Editor Config
✅ Eslint
✅ Prettier
✅ Typescript

Contexto  -> Recurso criado
            tb_monitoracao_item->js_observacao
                                 [{"cd_agente": "500500", "nm_agente": "Bot_Caesb", "dt_cadastro": "2025-04-25 17:41:09", "ds_comentario": "Isso é um teste!"}]
          -> Eventos para disparar na criação/leitura

O recurso criado foi uma observação na monitoriaItem X
O recurso mantido no manager é um monitoriaItem

❌ commentInMonitoringItem:cd_monitoracao_item:cd_agente:commentIndex
❓ cd_agente:commentInMonitoringItem:cd_monitoracao_item:commentIndex

monitoringItem -> Tabela do banco
cd_monitoracao_item -> chave primária
cd_agente -> Notification
commentIndex -> identificação do comentário

# Buscas

1. Buscar todas as notificações não lidas do agente -> `cd_agente:*`
2. Bucas notificações não lidas de um contexto para um agente -> `context:cd_context:cd_agente:*


# Eventos

connection -> setupControllers()
notifications -> users notifications amount
resource -> users resource notifications

create / read -> Emitir 2 eventos: atualizar notificações totais e do recurso

## Cliente

1. conecta
2. cria listeners:
   2.1 atualizar contador global
   2.2 atualizar outros contadores
3. emite join com o cd_agente

## Servidor

1. Na conexão:
  1.1 Cria listeners:
    1.1.1 join
    1.1.1 controllers
  1.2 Middlewares
  1.3 Erros

# Etapas finais
✅ Dockerfile
✅ Docker compose produção
✅ Integração manager

# Setup REDIS
É necessário criar o índice para buscas JSON no redis.
```bash
redis-cli FT.CREATE idx:notifications ON JSON PREFIX 1 notification: SCHEMA \
  $.id AS id TEXT \
  $.recipientId AS recipientId TEXT \
  $.metadata.type AS type TEXT \
  $.readAt AS readAt TEXT
```

# Contextos

## Quality\Monitoria
1. Quando a monitoria é liberada para feedback a notificação deve ser criada se ela existir (até o momento apenas uma pode existir)
2. É possível adicionar novas mensagens na visualização de monitoria liberada para feedback

# Dívida técnica

✅ Na leitura de uma notificação, deveria ser possível pegar o tipo da notificação, buscar notificações não lidas do tipo também para envio
  - Implica alterar índices no redis -> Verificar viabilidade
  - No momento resolve criar um caso de uso mais específico (por tipo de notificação) e remover o genérico
  - OU retornar todas as notificações não lidas do usuário agregadas por tipo, por exemplo
  - *Resolvido permitindo escolher a factory em runtime -> pode ser útil no futuro para não precisar criar novos controllers*
[] Trocar persistência por mongoDB
  - Acho que não será necessário, Redis é bem rápido e está funcionando. Só os testes que estão chatos de configurar
[] Corrigir teste E2E Redis -> É possível executar apenas um por vez
[] Conexão mais rígida - exigir autenticação
[] Tratamento de erros e validação de dados
[] Log e Tracing
[] Repositórios remotos
