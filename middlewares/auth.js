// перехватывает запросы к пользователю
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/UnauthorizedError';

const { JWT_SECRET, NODE_ENV } = process.env;

export default function (req, res, next) {
// export const auth = (req, res, next) => {
  let payload;
  try {
    // достаём авторизационный заголовок
    // const { authorization } = req.headers;
    const token = req.headers.authorization;
    // проверка токена
    if (!token) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }
    // извлечём токен. Таким образом, в переменную token запишется только JWT
    const validToken = token.replace('Bearer ', '');
    // верифицируем токен
    payload = jwt.verify(validToken, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    // if (error.message === 'NotAuthanticate') {
    // return res.status(constants.HTTP_STATUS_UNAUTHORIZED)
    // .send({ message: 'Неправильные почта или пароль' });
    // }

    // if (error.name === 'JsonWebTokenError') {
    // return res.status(constants.HTTP_STATUS_UNAUTHORIZED)
    // .send({ message: 'С токеном что-то не так' });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });

    next(error);
  }

  // обогатить объект req, запишем payload из токена в объект запроса
  req.user = payload;

  next();
}
