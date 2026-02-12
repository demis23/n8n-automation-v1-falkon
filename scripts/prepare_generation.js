module.exports = async function (items, tools) {
    // Эта функция симулирует "Генератор" или подготовку данных
    // Она будет вызывать наш templates.js и формировать структуру данных для нод OpenAI/DALL-E в n8n

    const templates = require('/home/node/scripts/content_templates.js');
    const result = [];

    for (const item of items) {
        const input = item.json;
        const output = { ...input };

        // Логика
        if (input.received_text && !input.received_photo) {
            // 1. Нужна генерация фото
            output.image_prompt = templates.imageGenerationPrompt(input.received_text);
            output.generated_text = null; // текст уже был
            output.target_action = 'generate_image';

        } else if (input.received_photo && !input.received_text) {
            // 2. Нужна генерация текста
            // Тут в n8n нужно будет использовать "Vision" модель (например, GPT-4o с картинкой)
            // чтобы описать фото, а потом использовать промпт.
            // Здесь мы только даем промпт для Vision:
            output.vision_prompt = "Опиши подробно, что изображено на этом фото, чтобы использовать это описание для поста.";
            output.text_prompt = templates.textGenerationPrompt("{{DESCRIPTION_FROM_VISION}}", 'short');
            output.target_action = 'generate_text';

        } else if (input.received_text && input.received_photo) {
            // 3. И то и то есть, возможно просто улучшить текст
            output.text_prompt = `Перепиши этот текст более engaging для Instagram: "${input.received_text}"`;
            output.target_action = 'refine_text';
        } else {
            // Фолбек - если ничего не понятно
            output.target_action = 'unknown_state';
            output.debug_info = `Text: ${!!input.received_text}, Photo: ${!!input.received_photo}`;
        }

        result.push({ json: output });
    }

    return result;
}
