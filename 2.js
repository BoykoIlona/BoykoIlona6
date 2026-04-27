const http = require('http');
const fs = require('fs');

// --- Створення сервера ---
const server = http.createServer((req, res) => {
    
    // Перевірка POST-запиту
    if (req.method === 'POST' && req.url === '/data') {
        let bodyData = '';

        // Збір даних
        req.on('data', chunk => {
            bodyData += chunk;
        });

        // Завершення збору
        req.on('end', () => {
            try {
                // Парсинг JSON
                let parsedObj = JSON.parse(bodyData);
                
                // Запис у файл
                fs.writeFile(__dirname + '/data.json', JSON.stringify(parsedObj), (err) => {
                    if (err) throw err;
                    
                    // Успішна відповідь
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                });
            } catch (e) {
                
                // Помилка JSON
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad request');
            }
        });
    } else {
        
        // Помилка маршруту
        res.writeHead(404);
        res.end();
    }
});

// --- Запуск сервера ---
server.listen(process.argv[2] || 3000);