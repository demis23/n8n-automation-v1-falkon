module.exports = function (items) {
    // Extract Base64 from Binary for Gemini API
    return items.map(item => {
        const binaryKeys = Object.keys(item.binary || {});

        // Если бинарников нет вообще
        if (binaryKeys.length === 0) {
            return {
                json: {
                    ...item.json,
                    debug_img_error: "No binary data found"
                }
            };
        }

        // Берем первый попавшийся бинарник
        const binaryData = item.binary[binaryKeys[0]];

        // ЖЕСТКОЕ принуждение к image/jpeg, так как Telegram обычно шлет JPEG
        // Gemini очень капризный к MIME типам.
        // Если это PNG, то JPEG тоже обычно прокатывает как 'image/jpeg' если это base64
        const mime = 'image/jpeg';

        return {
            json: {
                ...item.json,
                base64_image: binaryData.data,
                mime_type: mime,
                original_mime_debug: binaryData.mimeType // Чтобы видеть в n8n, что было на самом деле
            }
        };
    });
};
