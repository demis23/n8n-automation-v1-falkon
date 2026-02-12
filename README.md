# Управление n8n с Antigravity

Этот проект настроен для управления n8n через Antigravity. Основная идея — перенести логику сложных Code Node во внешние файлы (скрипты), которые можно редактировать прямо здесь.

## Структура
- `docker-compose.yml`: Конфигурация n8n с примонтированной папкой `scripts`.
- `.env`: Переменные окружения (Webhook URL, Timezone).
- `scripts/`: Папка для ваших JS/TS скриптов.

## Как использовать
1. **Запуск**:
   В терминале выполните:
   ```bash
   docker-compose up -d
   ```

2. **Написание кода**:
   Пишите код в папке `scripts/`. Например, `scripts/myLogic.js`.

3. **Использование в n8n**:
   В ноде **Code** используйте `require` для загрузки вашего скрипта.
   
   Пример кода в ноде n8n (с сбросом кэша для live reload):
   ```javascript
   const path = '/home/node/scripts/myLogic.js';
   delete require.cache[require.resolve(path)];
   const myLogic = require(path);
   return myLogic(items);
   ```
   
   Это позволяет вам редактировать `myLogic.js` в IDE (или через Antigravity), и изменения сразу будут доступны в n8n без перезапуска контейнера (если ваша логика не кэшируется глобально, но `require` обычно кэшируется. Чтобы обновить без перезапуска n8n, можно использовать технику очистки кэша `delete require.cache[require.resolve('/home/node/scripts/myLogic')]`).

## Настройка Ngrok
Убедитесь, что в `.env` указан правильный `WEBHOOK_URL` от вашего ngrok туннеля.
