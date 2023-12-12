import { Router } from 'express';
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards';

const cardRouter = Router(); // создали роутер

cardRouter.get('/', getCards);

cardRouter.post('/', createCard);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.put('/:cardId/likes', likeCard);

cardRouter.delete('/:cardId/likes', dislikeCard);

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
