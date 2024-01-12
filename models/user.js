import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import { UrlRegEx } from '../utils/UrlRegEx';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      // required: {
      // value: true,
      // message: 'Поле name является обязательным',
      // },
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    about: {
      type: String,
      // required: {
      // value: true,
      // message: 'Поле about является обязательным',
      // },
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    avatar: {
      type: String,
      // required: {
      // value: true,
      // message: 'Здесь должна быть ссылка',
      // },
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
      minlength: [8, 'Минимальная длина 8 символов'],
      // при поиске сущности не будет включаться в результат поиска, не светить пароль
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

// улучшим код: сделаем код проверки почты и пароля частью схемы User
// userSchema.statics.findUserByCredentials = function (email, password) {
// return this.findOne({ email }) // this — это модель User
// .then((user) => {
// не нашёлся — отклоняем промис
// if (!user) {
// return Promise.reject(new Error('Неправильные почта или пароль'));
// }

// нашёлся — сравниваем хеши
// return bcrypt.compare(password, user.password)
// .then((matched) => {
// if (!matched) {
// return Promise.reject(new Error('Неправильные почта или пароль'));
// }

// return user; // теперь user доступен
// });
// });
// };

// создаём модель и экспортируем её
export default mongoose.model('user', userSchema);
