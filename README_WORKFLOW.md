# Инструкция по созданию Workflow для генерации постов

Этот Workflow принимает сообщение от пользователя в Telegram (текст, фото или оба) и автоматически генерирует пост для Instagram/Facebook.

## Логика работы
1. **Telegram Trigger**: Ожидает входящее сообщение.
2. **Анализ**: Скрипт `scripts/telegram_incoming_handler.js` определяет тип контента (нужен текст или картинка).
3. **Подготовка**: Скрипт `scripts/prepare_generation.js` выбирает промпт из `scripts/content_templates.js`.
4. **AI Генерация**: Ноды OpenAI (или Anthropic) генерируют недостающий контент.
5. **Согласование**: Бот отправляет результат пользователю с кнопками.
6. **Публикация**: По кнопке "Опубликовать" пост отправляется в соцсети.

## Структура Workflow в n8n

### 1. Telegram Trigger
- **Credential**: Ваш бот токен.
- **Updates**: `message`, `channel_post` (если бот админ канала).
- **Download Images**: `On` (чтобы n8n скачал фото, если оно есть).

### 2. Code Node: "Analyze Input"
Вставьте этот код:
```javascript
const analyze = require('/home/node/scripts/telegram_incoming_handler.js');
delete require.cache[require.resolve('/home/node/scripts/telegram_incoming_handler.js')];
return analyze(items);
```

### 3. Switch Node
- Разделяет поток на 3 ветки:
  - `generate_image` (есть текст, нет фото) -> Идем в OpenAI DALL-E.
  - `generate_text` (есть фото, нет текста) -> Идем в OpenAI Vision (GPT-4o с картинкой).
  - `review_only` (есть и то и то) -> Идем сразу на подготовку к публикации.

### 4. Генерация (OpenAI Nodes)
- Для `generate_image`: Используйте ноду **OpenAI**, Operation: `Generate Image`. Prompt: `{{ $json["image_prompt"] }}` (это поле создаст наш скрипт).
- Для `generate_text`: Используйте ноду **OpenAI**, Operation: `Chat`, Model: `gpt-4o`. В сообщении User: Text: `{{ $json["text_prompt"] }}`, Image: `Input Data` (Binary Property `file_0`).

### 5. Code Node: "Prepare Approval"
После генерации, объедините ветки (Merge Node) и подайте в **Code Node**:
```javascript
const prepare = require('/home/node/scripts/prepare_approval.js');
delete require.cache[require.resolve('/home/node/scripts/prepare_approval.js')];
return prepare(items);
```

### 6. Telegram Node: "Send for Approval"
- **Operation**: `Send Message`.
- **Text**: `{{ $json["telegram_message"] }}` (или `{{ $json["generated_text"] }}`).
- **Reply Markup**: `Inline Keyboard`.
- **JSON**: Вставьте `{{ $json["telegram_keyboard"] }}` в поле Expression, или настройте кнопки вручную.
- **Photo**: Если сгенерировали фото, отправьте его тоже (через URL или Binary Property).

### 7. Wait for Button Click (Сложная часть)
Обычно для кнопок нужен отдельный Workflow с **Telegram Trigger (Callback Query)**.
Когда пользователь нажмет кнопку, Telegram пришлет событие `callback_query`.
В этом *втором* workflow вы:
1. Проверяете `callback_data`.
2. Если `publish:...`, то идете в ноды **Instagram** / **Facebook**.
3. Если `regenerate`, то запускаете генерацию заново (можно вызвать первый workflow через `Execute Workflow`).

## Редактирование шаблонов
Все тексты и промпты находятся в файле:
`d:/Projects/n8n/scripts/content_templates.js`
Вы можете редактировать его прямо в IDE, и n8n сразу подхватит изменения.
