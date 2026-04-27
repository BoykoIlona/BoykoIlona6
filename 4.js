const http = require('http');
const fs = require('fs');

// --- Створення сервера ---
const server = http.createServer((req, res) => {
    
    // Перевірка DELETE-запиту
    if (req.method === 'DELETE' && req.url.indexOf('/data/') !== -1) {
        
        // Отримання ID
        let idToDelete = parseInt(req.url.split('/')[2], 10);

        // Читання файлу
        fs.readFile(__dirname + '/data.json', 'utf8', (err, fileData) => {
            if (err) {
                res.writeHead(500);
                return res.end();
            }

            try {
                let arr = JSON.parse(fileData);
                let elementIndex = -1;

                // Пошук індексу
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id === idToDelete) {
                        elementIndex = i;
                        break;
                    }
                }

                // Якщо не знайдено
                if (elementIndex === -1) {
                    res.writeHead(404);
                    return res.end();
                }

                // Видалення елемента
                arr.splice(elementIndex, 1);

                // Збереження змін
                fs.writeFile(__dirname + '/data.json', JSON.stringify(arr), (err) => {
                    res.writeHead(200);
                    res.end();
                });

            } catch (error) {
                
                // Помилка JSON
                res.writeHead(400);
                res.end();
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