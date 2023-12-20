import { constants } from 'http2';
import mongoose from 'mongoose';

import User from '../models/user';
import { NotFoundError } from '../utils/NotFoundError';

// чтобы посмотреть все константы ошибок:
// console.log(Object.fromEntries(
// Object.entries(constants)
// .filter(([key]) => key.startsWith('HTTP_STATUS_')),
// ));

// запрос в базу данных, асинхронная операция
// async чтобы не использовать промисы
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message
      // не показывать, чтобы не помогать злоумышленникам
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по указанному _id не найден'),
    );

    // .orFail(new Error('NotFound'));

    // if(!user) {
    // throw new Error('NotFound');
    // }
    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    // if(error.message === 'NotFound') {
    // return res
    // .status(HTTP_STATUS_NOT_FOUND)
    // .send({ message: 'Пользователь по указанному _id не найден' });
    // }

    // классы обрабатывают ошибки
    switch (error.name) {
      case 'CastError':
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Передан не валидный id',
          error: error.message,
        });
      case 'NotFoundError':
        return res.status(error.statusCode).send({ message: error.message });
      default:
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Ошибка на стороне сервера',
          // error: error.message
          // не показывать, чтобы не помогать злоумышленникам
        });
    }
  }
};

export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
  } catch (error) {
    switch (error.name) {
      case 'ValidationError':
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
          error: error.message,
        });

      case 'MongoServerError':
        return error.code === 11000
          ? res
            .status(constants.HTTP_STATUS_CONFLICT)
            .send({ message: 'Пользователь с таким именем уже существует' })
          : res
            .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
            .send({ message: 'Ошибка соединения с базой данных' });
      default:
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Ошибка на стороне сервера',
          // error: error.message
          // не показывать, чтобы не помогать злоумышленникам
        });
    }
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    /* eslint no-underscore-dangle: ['error', { 'allow': ['_id'] }] */
    const userId = req.user._id;
    const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя
    const userProfile = await User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true,
        // данные будут валидированы перед изменением
      },
    ).orFail(
      () => new NotFoundError('Пользователь по указанному _id не найден'),
    );

    return res.status(constants.HTTP_STATUS_OK).send(userProfile);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(error.statusCode).send({ message: error.message });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении профиля',
        error: error.message,
      });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message
      // не показывать, чтобы не помогать злоумышленникам
    });
  }
};

export const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body; // получим из объекта запроса аватар пользователя
    const userProfile = await User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    ).orFail(
      () => new NotFoundError('Пользователь по указанному _id не найден'),
    );

    return res.status(constants.HTTP_STATUS_OK).send(userProfile);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.status(error.statusCode).send({ message: error.message });
    }

    if (error.name === 'ValidationError') {
      return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
        message:
          'Переданы некорректные данные при обновлении аватара пользователя',
        error: error.message,
      });
    }

    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: 'Ошибка на стороне сервера',
      // error: error.message
      // не показывать, чтобы не помогать злоумышленникам
    });
  }
};
