const http = require('http');
const fs = require('fs');

// --- Створення сервера ---
const server = http.createServer((req, res) => {
    
    // Перевірка PUT-запиту
    if (req.method === 'PUT' && req.url.indexOf('/data/') === 0) {
        
        // Отримання ID
        let urlParts = req.url.split('/');
        let targetId = Number(urlParts[2]);
        let requestBody = '';

        // Збір даних
        req.on('data', chunk => { requestBody += chunk; });

        // Завершення збору
        req.on('end', () => {
            try {
                let newData = JSON.parse(requestBody);

                // Читання файлу
                fs.readFile(__dirname + '/data.json', 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        return res.end();
                    }

                    let itemsArray = JSON.parse(data);
                    let isFound = false;

                    // Пошук та оновлення
                    for (let i = 0; i < itemsArray.length; i++) {
                        if (itemsArray[i].id === targetId) {
                            Object.assign(itemsArray[i], newData);
                            itemsArray[i].id = targetId; 
                            isFound = true;
                            break;
                        }
                    }

                    // Якщо не знайдено
                    if (isFound === false) {
                        res.writeHead(404);
                        return res.end('Not found');
                    }

                    // Збереження змін
                    fs.writeFile(__dirname + '/data.json', JSON.stringify(itemsArray), (err) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    });
                });
            } catch (e) {
                
                // Помилка JSON
                res.writeHead(400);
                res.end();
            }
        });
    }
});

// --- Запуск сервера ---
server.listen(process.argv[2] || 3000);