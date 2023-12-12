import { Router } from 'express';
import {
  createUser, getUserById, getUsers, updateUserAvatar, updateUserProfile,
} from '../controllers/users';

// const router = require('express').Router(); // создали роутер
const userRouter = Router(); // создали роутер

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUserById);

userRouter.post('/', createUser);

userRouter.patch('/me', updateUserProfile);

userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter; // экспортировали роутер
