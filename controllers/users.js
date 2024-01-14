import { constants } from 'http2';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
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
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по указанному _id не найден'),
    );

    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
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

    // const userLogin = await User.findUserByCredentials(email, password);

    // аутентификация успешна

    const token = generateToken({ _id: userLogin._id });

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
    next(error);
  }
};

export const getUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(
      () => new NotFoundError('Пользователь по указанному _id не найден'),
    );

    return res.status(constants.HTTP_STATUS_OK).send(user);
  } catch (error) {
    next(error);
  }
};
