import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { UrlRegEx } from '../utils/UrlRegEx';
import {
  createUser, login,
} from '../controllers/users';

const authRouter = Router(); // создали роутер

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(), // regex(/abc\d{3}/),
    password: Joi.string().required(), // pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  }).unknown(true),
}), login);

// Если тело запроса не пройдёт валидацию, контроллер createUser вообще не запустится
authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(UrlRegEx),
    email: Joi.string().required().email(), // regex(/abc\d{3}/),
    password: Joi.string().required(), // pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  }).unknown(true),
}), createUser);

export default authRouter; // экспортировали роутер
