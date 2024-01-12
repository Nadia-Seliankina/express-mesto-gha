import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUserById, getUsers, updateUserAvatar, updateUserProfile, getUserActive,
} from '../controllers/users';

// const router = require('express').Router(); // создали роутер
const userRouter = Router(); // создали роутер

userRouter.get('/', getUsers);

userRouter.get('/me', getUserActive);
// выше /:userId. Потому что на роут /users/:userId прилетает всё, начинающееся с /users

userRouter.get('/:userId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUserById);

// Если тело запроса не пройдёт валидацию, контроллер не запустится
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }).unknown(true),
}), updateUserProfile);

// Если тело запроса не пройдёт валидацию, контроллер не запустится
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }).unknown(true),
}), updateUserAvatar);

export default userRouter; // экспортировали роутер
