import { constants } from 'http2';

import Card from '../models/card';
import { NotFoundError } from '../utils/NotFoundError';

export const getCards = async (req, res) => {
  try {
    const users = await Card.find({});
    return res.send(users);
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message
      // не показывать, чтобы не помогать злоумышленникам
    });
  }
};

// export const createCard = (req, res) => {
// мидлвэр добавляет в каждый запрос объект user.
// Берите из него идентификатор пользователя в контроллере создания карточки:
// console.log(req.user._id); // _id станет доступен
// Это временное решение. Мы захардкодили идентификатор пользователя,
// поэтому кто бы ни создал карточку, в базе у неё будет один и тот же автор.

// const { name, link, ownerId } = req.body; // получим из объекта запроса имя и ссылку карточки

// Card.create({ name, link, owner: ownerId}) // создадим документ на основе пришедших данных
// вернём записанные в базу данные
// .then(card => res.send({ data: card }))
// данные не записались, вернём ошибку
// .catch(err => res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
// };

export const createCard = async (req, res) => {
  try {
    // мидлвэр добавляет в каждый запрос объект user.
    // Берите из него идентификатор пользователя в контроллере создания карточки:
    console.log(req.user._id); // _id станет доступен
    // Это временное решение. Мы захардкодили идентификатор пользователя,
    // поэтому кто бы ни создал карточку, в базе у неё будет один и тот же автор.

    const newCard = await Card.create(req.body);

    return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные при создании карточки',
          error: error.message,
        });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message // не показывать, чтобы не помогать злоумышленникам
    });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId).orFail(() => new NotFoundError('Карточка по указанному _id не найдена'));

    return res.send(card);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(error.statusCode).send({ message: error.message });
    }

    if (error.name === 'CastError') {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({
          message: 'Передан невалидный ID.',
          error: error.message,
        });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message // не показывать, чтобы не помогать злоумышленникам
    });
  }
};

export const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).orFail(() => new NotFoundError('Передан несуществующий _id карточки'));

    return res.send(card);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(error.statusCode).send({ message: error.message });
    }

    if (error.name === 'CastError') {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные для постановки лайка.',
          error: error.message,
        });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message // не показывать, чтобы не помогать злоумышленникам
    });
  }
};

export const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).orFail(() => new NotFoundError('Передан несуществующий _id карточки'));
    return res.send(card);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(error.statusCode).send({ message: error.message });
    }

    if (error.name === 'CastError') {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({
          message: 'Переданы некорректные данные для снятии лайка.',
          error: error.message,
        });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message // не показывать, чтобы не помогать злоумышленникам
    });
  }
};
