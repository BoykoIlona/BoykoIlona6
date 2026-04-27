const http = require('http');
const fs = require('fs');

// --- Створення сервера ---
const server = http.createServer((req, res) => {
    
    // Перевірка GET-запиту
    if (req.method === 'GET' && req.url === '/data') {
        
        // Читання файлу
        fs.readFile(__dirname + '/data.json', 'utf8', (err, fileContent) => {
            
            // Обробка помилки читання
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'File error' }));
                return;
            }
            
            // Успішна відповідь
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(fileContent);
        });
    } else {
        
        // Помилка маршруту
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// --- Запуск сервера ---
server.listen(process.argv[2] || 3000);