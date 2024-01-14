import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';
import { UrlRegEx } from '../utils/UrlRegEx';
import { UnauthorizedError } from '../errors/UnauthorizedError';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => UrlRegEx.test(v),
        message: 'Дана некорректная ссылка',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      unique: true,
      required: {
        value: true,
        message: 'Поле email является обязательным',
      },
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: {
        value: true,
        message: 'Поле password является обязательным',
      },
      // при поиске сущности не будет включаться в результат поиска, не светить пароль
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

// сделаем код проверки почты и пароля частью схемы User
// userSchema.statics.findUserByCredentials = async function (email, password, next) {
// try {
// поискать пользователя с полученной почтой в базе
// const userLogin = await this.findOne({ email }) // this — это модель User
// .select('+password');
// .orFail(next(new UnauthorizedError('Неправильные почта или пароль')));
// if (!userLogin) {
// throw new UnauthorizedError('Неправильные почта или пароль');
// return next(new UnauthorizedError('Неправильные почта или пароль'));
// }
// сравниваем переданный пароль и хеш из базы
// const matched = await bcrypt.compare(password, userLogin.password);
// хеши не совпали — отклоняем промис
// if (!matched) {
// throw new UnauthorizedError('Неправильные почта или пароль');
// return next(new UnauthorizedError('Неправильные почта или пароль'));
// }

// return userLogin; // теперь user доступен
// } catch (error) {
// next(error);
// }
// };

// создаём модель и экспортируем её
export default mongoose.model('user', userSchema);
