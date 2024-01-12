import jwt from 'jsonwebtoken';

const { JWT_SECRET, NODE_ENV } = process.env;

export const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret', {
  expiresIn: '7d',
});
