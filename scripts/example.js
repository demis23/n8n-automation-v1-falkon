module.exports = function (items) {
    // This is an example function you can call from n8n Code Node
    // inside n8n Code Node:
    // const myFunc = require('/home/node/scripts/example');
    // return myFunc(items);

    return items.map(item => {
        return {
            json: {
                ...item.json,
                processedBy: 'Antigravity Local Script'
            }
        }
    });
}
