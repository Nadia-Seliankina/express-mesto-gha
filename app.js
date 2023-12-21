// Здесь функциональность точки входа

import express, { json } from 'express'; // подключаем express
import mongoose from 'mongoose';
import { constants } from 'http2';
import 'dotenv/config'; // подключать над роутами

// const fs = require('fs');
// import path from 'path';

// импортируем роутер
// import router from './routes';
import router from './routes/index';

// BASE_PATH — это URL сервера. Он хранится в переменных окружения
// const { PORT = 3000, BASE_PATH  } = process.env;
// const { PORT=3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { PORT, MONGO_URL } = process.env;

// создаём приложение методом express
const app = express();

// раздача статики
// если мидлвар для любых маршрутов первый аргумент можно опустить
// app.use(express.static('/' + '/public'));

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'public')));
// теперь клиент имеет доступ только к публичным файлам

// мидлвар для получения body (синхронная операция обработка body на сервере)
// Обогащает объект req.body
app.use(json());

// подключаемся к серверу mongo
// mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
// mongoose.connect(MONGO_URL, () =>
// console.log('База подключена')
// );
mongoose.connect(MONGO_URL);

// мидлвэр
// временное решение авторизации - добавляет в каждый запрос объект user
app.use((req, res, next) => {
  req.user = {
    _id: '656b2d07d537f1b32a54d8e1',
  };

  next();
});

// мидлвар на авторизацию, обогащает реквест пользователем
// логирование или аутентификацию пользователя, расширить объект данными

// Вынесём отправку ответа в отдельную функцию
// const sendUser = (req, res) => {
// const { name, age } = users[req.params.id];
// res.send(`Пользователь ${name}, ${age} лет`);
// };

// Проверим, существует ли пользователь:
// const doesUserExist = (req, res, next) => {
// if (!users[req.params.id]) {
// res.send(`Такого пользователя не существует`);
// return; // если пользователя нет, мы выйдем из функции и больше ничего происходить не будет
// }

// next();
// если движок дошёл до функции next, он будет искать следующий обработчик того же запроса
// };

// const sendUser = (req, res, next) => {
// res.send(users[req.params.id]);
// };

// Если пользователь найден, вызовем функцию, переданную третьим аргументом.
// Осталось написать обработчик запроса
// router.get('/users/:id', doesUserExist);
// мидлвэр, чтобы проверять уровень доступа пользователя
// router.get('/users/:id', doesUserHavePermission);
// Просто добавили обработчик, не трогая код других мидлвэров
// router.get('/users/:id', sendUser);

// запускаем router
app.use(router);

// При запросах по несуществующим маршрутам
app.use('*', (req, res) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({
    message: '404. Страница не найдена.',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
  });
});

// будем принимать сообщения с PORT
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
