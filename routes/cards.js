import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { UrlRegEx } from '../utils/UrlRegEx';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const cardRouter = Router(); // создали роутер

cardRouter.get('/', getCards);

// Если тело запроса не пройдёт валидацию, контроллер createCard вообще не запустится
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(UrlRegEx),
  }).unknown(true),
}), createCard);

cardRouter.delete(
  '/:cardId',
  celebrate({
    // валидируем параметры
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24).hex(),
    }).unknown(true),
  }),
  deleteCard,
);

cardRouter.put('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }).unknown(true),
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }).unknown(true),
}), dislikeCard);

export default cardRouter; // экспортировали роутер

// обработке адресов со множественной вложенностью
// app.get('/users/:id/albums/:album/:photo', (req, res) => {
// const { id, album, photo } = req.params;

/* При обращению к адресу 'http://localhost:3000/users/123/albums/333/2'
     параметры запроса будут записаны в таком виде:
     {'id':'123','album':'333','photo':'2'}

     Мы записали их в переменные id, album и photo */

// res.send(`Мы на странице пользователя с id ${id},
// смотрим альбом №${album} и фотографию №${photo}`);
// });
