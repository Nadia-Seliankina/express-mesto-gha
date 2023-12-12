import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: {
        value: true,
        message: 'Поле name является обязательным',
      },
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    link: {
      type: String,
      required: {
        value: true,
        message: 'Здесь должна быть ссылка',
      },
    },
    // создаём поле владельца карточки
    owner: {
      // ссылка на модель автора карточки
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        // список лайкнувших пост пользователей
        // описываем схему для одного элемента
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false, timestamps: true },
);

// создаём модель и экспортируем её
export default mongoose.model('card', cardSchema);
