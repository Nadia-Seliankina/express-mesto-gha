import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUserById, getUsers, updateUserAvatar, updateUserProfile, getUserActive,
} from '../controllers/users';
import { UrlRegEx } from '../utils/UrlRegEx';

// const router = require('express').Router(); // создали роутер
const userRouter = Router(); // создали роутер

userRouter.get('/', getUsers);

userRouter.get('/me', getUserActive);
// выше /:userId. Потому что на роут /users/:userId прилетает всё, начинающееся с /users

userRouter.get('/:userId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }).unknown(true),
}), getUserById);

// Если тело запроса не пройдёт валидацию, контроллер не запустится
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).unknown(true),
}), updateUserProfile);

// Если тело запроса не пройдёт валидацию, контроллер не запустится
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(UrlRegEx),
  }).unknown(true),
}), updateUserAvatar);

export default userRouter; // экспортировали роутер
