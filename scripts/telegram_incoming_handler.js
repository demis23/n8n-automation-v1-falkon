module.exports = async function (items, tools) {
    // Этот скрипт анализирует входящее сообщение от Telegram
    // и решает, что нужно сгенерировать.

    const result = [];

    for (const item of items) {
        const message = item.json.message || item.json.channel_post;

        if (!message) {
            continue;
        }

        const output = {
            chat_id: message.chat.id,
            received_text: message.text || message.caption || '',
            received_photo: null,
            action_needed: 'unknown'
        };

        // Проверяем наличие фото
        // В n8n бинарные данные фото обычно приходят отдельно, 
        // но здесь мы смотрим на структуру сообщения JSON
        if (message.photo) {
            // Берем ID самого большого фото
            output.received_photo = message.photo[message.photo.length - 1].file_id;
        }

        // Логика определения действий
        if (output.received_text && output.received_photo) {
            output.action_needed = 'refine_text'; // Совпадаем с prepare_generation.js
        } else if (output.received_text && !output.received_photo) {
            output.action_needed = 'generate_image';
        } else if (!output.received_text && output.received_photo) {
            output.action_needed = 'generate_text';
        } else {
            output.action_needed = 'unknown';
        }


        result.push({ json: output });
    }

    return result;
}
