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
