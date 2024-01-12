import { constants } from 'http2';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { NotFoundError } from '../utils/NotFoundError';
import { UnauthorizedError } from '../utils/UnauthorizedError';
import { generateToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

// чтобы посмотреть все константы ошибок:
// console.log(Object.fromEntries(
// Object.entries(constants)
// .filter(([key]) => key.startsWith('HTTP_STATUS_')),
// ));

// запрос в базу данных, асинхронная операция
// async чтобы не использовать промисы
/* eslint consistent-return: "off" */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(constants.HTTP_STATUS_OK).send(users);
  } catch (error) {
    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
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

    // switch (error.name) {
    // case 'CastError':
    // return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
    // message: 'Передан не валидный id',
    // error: error.message,
    // });
    // case 'NotFoundError':
    // return res.status(error.statusCode).send({ message: error.message });
    // default:
    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });
    // }
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    // хешируем пароль
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    });

    // return res.status(constants.HTTP_STATUS_CREATED).send(newUser);
    return res.status(constants.HTTP_STATUS_CREATED).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (error) {
    // switch (error.name) {
    // case 'ValidationError':
    // return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
    // message: 'Переданы некорректные данные при создании пользователя',
    // error: error.message,
    // });

    // case 'MongoServerError':
    // return error.code === MONGO_DUBLICATE_ERROR_CODE
    // ? res
    // .status(constants.HTTP_STATUS_CONFLICT)
    // .send({
    // message: 'Пользователь с таким именем или email уже существует',
    // error: error.message,
    // })
    // : res
    // .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
    // .send({ message: 'Ошибка соединения с базой данных' });
    // default:
    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });
    // }
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
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
    // if (error.name === 'NotFoundError') {
    // return res.status(error.statusCode).send({ message: error.message });
    // }

    // if (error instanceof mongoose.Error.ValidationError) {
    // return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
    // message: 'Переданы некорректные данные при обновлении профиля',
    // error: error.message,
    // });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });
    next(error);
  }
};

export const updateUserAvatar = async (req, res, next) => {
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
    // if (error.name === 'NotFoundError') {
    // return res.status(error.statusCode).send({ message: error.message });
    // }

    // if (error.name === 'ValidationError') {
    // return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
    // message:
    // 'Переданы некорректные данные при обновлении аватара пользователя',
    // error: error.message,
    // });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // поискать пользователя с полученной почтой в базе
    const userLogin = await User.findOne({ email })
      .select('+password')
      .orFail(() => new UnauthorizedError('Неправильные почта или пароль'));
    // сравниваем переданный пароль и хеш из базы
    const matched = await bcrypt.compare(password, userLogin.password);
    // хеши не совпали — отклоняем промис
    if (!matched) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }
    // аутентификация успешна

    const token = generateToken({ _id: userLogin._id });

    // return res.status(constants.HTTP_STATUS_OK).send(userLogin);

    // Мы рекомендуем записывать JWT в httpOnly куку.
    // Если вам проще сделать это в теле ответа, такое решение тоже будет принято
    return res.status(constants.HTTP_STATUS_OK).send({
      data: {
        name: userLogin.name,
        email: userLogin.email,
        _id: userLogin._id,
      },
      token,
    });
  } catch (error) {
    // if (error.message === 'NotAuthanticate') {
    // return res.status(constants.HTTP_STATUS_UNAUTHORIZED)
    // .send({ message: 'Неправильные почта или пароль' });
    // }

    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });

    next(error);
  }
};

// Код метода готов. Теперь мы можем применить его в обработчике аутентификации:
// controllers/users.js

// const jwt = require('jsonwebtoken'); //

// module.exports.login = (req, res) => {
// const { email, password } = req.body;

// return User.findUserByCredentials(email, password)
// .then((user) => {
// создадим токен
// const token = jwt.sign({ _id: user._id }, 'some-secret-key');

// вернём токен
// res.send({ token });
// })
// .catch((err) => {
// res
// .status(401)
// .send({ message: err.message });
// });
// };

export const getUserActive = async (req, res, next) => {
  try {
    console.log('active', req.user._id);
    const user = await User.findById(req.user._id).orFail(
      () => new NotFoundError('Пользователь по указанному _id не найден'),
    );

    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    // switch (error.name) {
    // case 'CastError':
    // return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
    // message: 'Передан не валидный id',
    // error: error.message,
    // });
    // case 'NotFoundError':
    // return res.status(error.statusCode).send({ message: error.message });
    // default:
    // return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
    // message: 'Ошибка на стороне сервера',
    // error: error.message
    // не показывать, чтобы не помогать злоумышленникам
    // });
    // }
    // .catch(next); // добавили catch
    // .catch(err => next(err));
    next(error);
  }
};
