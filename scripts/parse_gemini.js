module.exports = function (items) {
    // Parse Gemini Response
    // Google API returns nested structure: candidates[0].content.parts[0].text

    if (!items || items.length === 0) return [];

    const response = items[0].json;
    let text = '';

    try {
        if (response.candidates && response.candidates.length > 0) {
            text = response.candidates[0].content.parts[0].text;
        } else {
            text = 'No content generated (check safety settings or token limit)';
        }
    } catch (e) {
        text = `Error parsing Gemini response: ${e.message}`;
    }

    // Возвращаем результат, обогащенный сгенерированным текстом
    return [{
        json: {
            ...items[0].json,
            generated_text: text
        }
    }];
};
