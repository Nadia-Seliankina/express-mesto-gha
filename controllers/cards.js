import { constants } from 'http2';
import Card from '../models/card';
import { NotFoundError } from '../utils/NotFoundError';
import { ForbiddenError } from '../utils/ForbiddenError';

/* eslint consistent-return: "off" */
export const getCards = async (req, res, next) => {
  try {
    const users = await Card.find({});
    return res.send(users);
  } catch (error) {
    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });
    next(error);
  }
};

export const createCard = async (req, res, next) => {
  try {
    // мидлвэр auth добавляет в каждый запрос объект user.
    // Берите из него идентификатор пользователя в контроллере создания карточки
    console.log('card', req.user._id); // _id станет доступен

    const ownerId = req.user._id;

    const {
      name, link,
    } = req.body;

    // const newCard = await Card.create(req.body);

    const newCard = await Card.create({
      name, link, owner: ownerId,
    });

    return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    // if (error.name === 'ValidationError') {
    // return res
    // .status(constants.HTTP_STATUS_BAD_REQUEST)
    // .send({
    // message: 'Переданы некорректные данные при создании карточки',
    // error: error.message,
    // });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message // не показывать, чтобы не помогать злоумышленникам
    // });

    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(() => new NotFoundError('Карточка по указанному _id не найдена'));

    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Недостаточно прав');
    }

    await Card.deleteOne(card);

    // const card = await Card.findByIdAndDelete(cardId)
    // .orFail(() => new NotFoundError('Карточка по указанному _id не найдена'));

    return res.send(card);
  } catch (error) {
    // if (error.name === 'NotFoundError') {
    // return res.status(error.statusCode).send({ message: error.message });
    // }

    // if (error.name === 'CastError') {
    // return res
    // .status(constants.HTTP_STATUS_BAD_REQUEST)
    // .send({
    // message: 'Передан невалидный ID.',
    // error: error.message,
    // });
    // }

    // if (error.message === 'ForbiddenDelete') {
    // return res.status(constants.HTTP_STATUS_FORBIDDEN).send({ message: error.message });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message // не показывать, чтобы не помогать злоумышленникам
    // });

    next(error);
  }
};

export const likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).orFail(() => new NotFoundError('Передан несуществующий _id карточки'));

    return res.send(card);
  } catch (error) {
    // if (error.name === 'NotFoundError') {
    // return res.status(error.statusCode).send({ message: error.message });
    // }

    // if (error.name === 'CastError') {
    // return res
    // .status(constants.HTTP_STATUS_BAD_REQUEST)
    // .send({
    // message: 'Переданы некорректные данные для постановки лайка.',
    // error: error.message,
    // });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message // не показывать, чтобы не помогать злоумышленникам
    // });

    next(error);
  }
};

export const dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).orFail(() => new NotFoundError('Передан несуществующий _id карточки'));
    return res.send(card);
  } catch (error) {
    // if (error.name === 'NotFoundError') {
    // return res.status(error.statusCode).send({ message: error.message });
    // }

    // if (error.name === 'CastError') {
    // return res
    // .status(constants.HTTP_STATUS_BAD_REQUEST)
    // .send({
    // message: 'Переданы некорректные данные для снятии лайка.',
    // error: error.message,
    // });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message // не показывать, чтобы не помогать злоумышленникам
    // });

    next(error);
  }
};
