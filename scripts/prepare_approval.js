module.exports = async function (items, tools) {
    // Этот скрипт подготавливает данные для отправки в Telegram
    // и создает интерактивные кнопки (Inline Keyboard).

    const result = [];

    for (const item of items) {
        const input = item.json;

        const message = {
            chat_id: input.chat_id,
            text: input.generated_text || input.refined_text || input.received_text || "Контент готов!",
            // Здесь мы не можем напрямую указать Reply Markup для n8n ноды, 
            // но мы можем подготовить JSON структуру для использования in 'Telegram Node' -> 'Custom HTTP'
        };

        const reply_markup = {
            inline_keyboard: [
                [
                    { text: "👍 Опубликовать", callback_data: `publish:${input.message_id || 'new'}` },
                    { text: "🔄 Сгенерировать заново", callback_data: `regenerate:${input.message_id || 'new'}` }
                ],
                [
                    { text: "❌ Отмена", callback_data: `cancel:now` }
                ]
            ]
        };

        result.push({
            json: {
                ...input,
                telegram_message: message.text,
                telegram_keyboard: JSON.stringify(reply_markup)
            }
        });
    }

    return result;
}
