import { constants } from 'http2';
import Card from '../models/card';
import { NotFoundError } from '../errors/NotFoundError';
import { ForbiddenError } from '../errors/ForbiddenError';

/* eslint consistent-return: "off" */
export const getCards = async (req, res, next) => {
  try {
    const users = await Card.find({});
    return res.send(users);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req, res, next) => {
  try {
    // мидлвэр auth добавляет в каждый запрос объект user.
    const ownerId = req.user._id;

    const {
      name, link,
    } = req.body;

    const newCard = await Card.create({
      name, link, owner: ownerId,
    });

    return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
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

    return res.send(card);
  } catch (error) {
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
    next(error);
  }
};
