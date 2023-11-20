// const fs = require('fs');
// const path = require('path');

// const http = require('http'); // Подключим API

// подключите express
const express = require('express');

// импорт модулей
// const utils = require('./utils');
// const helpers = require('../../helpers');
// const { someFunction, someValue } = require('./utils');
// const { getMainPage, postForm } = require('./routes');

// BASE_PATH — это URL сервера. Он хранится в переменных окружения
// const { PORT = 3000, BASE_PATH  } = process.env;
const { PORT = 3000 } = process.env;

// создайте приложение методом express
const app = express();

// создаём сервер
// const server = http.createServer(router);
// const server = http.createServer((req, res) => {
// устанавливаем ответ
// console.log('Пришёл запрос!');

// console.log(req.url); // /hello
// console.log(req.method); // GET
// console.log(req.headers); // здесь будут заголовки запроса
// console.log(req.body); // а здесь тело запроса, но у GET запроса его нет

// res.statusMessage = 'OK'; // сообщение ответа
// статус ответа, добавить ответу заголовок
// res.writeHead(200, {
// 'Content-Type': 'text/html; charset=utf8'
// });

// res.write('Hello, '); // отправить часть ответа — строку "Hello, "
// res.write('world!'); // отправить часть ответа — строку "world!"

// res.end('<h1>Привет, мир!</h1>', 'utf8');
// закончить отправку ответа, в методе end тоже можно передать данные
// res.end(markup);

// чтобы страница приходила только на GET запросы к URL главной страницы (просто слеш /)
// if (req.url === '/' && req.method === 'GET') {
// res.writeHead(200, {
// 'Content-Type': 'text/html'
// });

// res.end(mainPageMarkup);

// getMainPage(req, res);
// };

// Чтобы страница приходила при отправке формы
// if (req.url === '/submit' && req.method === 'POST') {
// сервер должен записывать данные
// let body = '';

// req.on('data', (chunk) => {
// body += chunk;
// });

// req.on('end', () => {
// res.writeHead(200, {
// 'Content-Type': 'text/html'
// });

// res.end(submitSuccessMarkup);

// postForm(req, res);
// });

// const server = http.createServer((req, res) => {
// const dataPath = path.join(__dirname, 'data.json');

// fs.readFile(dataPath, { encoding: 'utf8' }, (err, data) => {
// if (err) {
// console.log(err);
// return;
// }

// const songs = JSON.parse(data);

// res.writeHead(200, {
// 'Content-Type': 'text/html'
// });

// const markup = generateMainView(songs);

// res.end(markup);
// });

// });

// });

// app.listen(PORT); // будем принимать сообщения с PORT
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// переменные окружения - передать их при запуске сервера из терминала
// - перед командой запуска прописывают имена переменных и их значения:
// NODE_ENV=production node index.js
// # NODE_ENV - имя переменной окружения, а production — её значение

// Внутри скриптов переменные окружения хранятся в объекте process.env:
// if (process.env.NODE_ENV !== 'production') {
// console.log('Код запущен в режиме разработки');
// }

// Именно так мы укажем порт — при запуске сервера:
// PORT=3000 node app.js

// <form class="container" action="${BASE_PATH}/submit" method="POST" enctype="text/plain">
